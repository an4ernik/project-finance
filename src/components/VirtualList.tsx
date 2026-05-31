import {useRef, useState, useEffect, useMemo} from 'react';
import {useVirtualizer, useWindowVirtualizer} from '@tanstack/react-virtual';

import VirtualItem from './VirtualItem';
import Spinner from './Spinner';
import {t} from 'i18next';
import {toast} from 'sonner';
import {
  useDeleteTransaction,
  useGetTransactions,
} from '@/shared/api/generated/transaction-management/transaction-management';
import RemoveDialog from '@/pages/income/modal/RemoveDialog';
import NotAvailableTransactions from './NotAvailableTransactions';
import {
  ALL_CATEGORIES_VALUE,
  type IntervalUnitType,
  type Item,
  type TransactionFiltersFormValues,
  type TransactionUI,
} from '@/types/types';
import VirtualItemSkeleton from './skeletons/VIrtualListSkeleton';
import {applyFilters, isToday} from '@/helpers/helpers';
import TransactionModal from '@/pages/income/modal/TransactionModal';
import {useQueryClient} from '@tanstack/react-query';

interface VirtualListProps {
  type: 'INCOME' | 'EXPENSE';
  formFilters: TransactionFiltersFormValues;
  setTotalAmount: (amount: number) => void;
}

const VirtualList = ({type, formFilters, setTotalAmount}: VirtualListProps) => {
  const queryClient = useQueryClient();
  const mutationConfig = {
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/api/v1/transactions'],
          exact: false,
        });

        queryClient.refetchQueries({
        predicate: (query) => { 
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === '/api/v1/transactions'
          );
        },
      });

      },
    },
  };

  const {data, isPending: isLoading} = useGetTransactions({type});
  const {mutateAsync: deleteIncome} = useDeleteTransaction(mutationConfig);

  const parentRef = useRef<HTMLDivElement>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransactionUI | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('update');

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const handleConfirmDelete = async (
    id: number,
    scope = '"ONLY_THIS"' as 'ONLY_THIS' | 'THIS_AND_FUTURE',
  ) => {
    const options = {
      id,
      params: {
        recurringScope: scope,
      },
    };
    try {
      await deleteIncome(options);
      toast.success(t(`incomeModal.transaction.success.delete.${type}`));
    } catch (error) {
      console.error(error);
      toast.error(t(`incomeModal.transaction.error.delete.${type}`));
    } finally {
      setIsRemoveDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleOpenDelete = (item: Item) => {
    setItemToDelete(item);
    setIsRemoveDialogOpen(true);
  };

  const handleEdit = (item: Item) => {
    setSelectedItem({
      id: item.id,
      amount: Number(item.amount),
      category: {
        id: item.category.id,
        name: item.category.name,
        icon: item.category.icon,
        type: item.category.type ?? type,
      },
      date: item.date,
      description: item.description,
      intervalUnit: item.intervalUnit as IntervalUnitType,
      Icon: undefined,
    });
    setModalMode('update');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
 
  // 2. Localized debounce cycle
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(formFilters.search ?? '');
    }, 800);
    return () => clearTimeout(timeout);
  }, [formFilters.search]);

  // Window check resize tracking...
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const transactions = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  useEffect(() => {
    let total = 0;
    transactions.forEach(item => {
      total += Number(item.amount);
    });
    setTotalAmount(total);
  }, [transactions, setTotalAmount]);

  // 3. Keep filtering logic right alongside the list rendering mechanisms
  const filteredData = useMemo(() => {
    const normalized = {
      period: formFilters.period ?? 'all',
      fromDate: formFilters.fromDate,
      toDate: formFilters.toDate,
      category: formFilters.category ?? [ALL_CATEGORIES_VALUE],
      search: formFilters.search ?? '',
    };
    return applyFilters(transactions, normalized, debouncedSearch);
  }, [transactions, formFilters, debouncedSearch]);

  const todayRows = filteredData.filter(item => isToday(new Date(item.date)));
  const earlierRows = filteredData.filter(
    item => !isToday(new Date(item.date)),
  );
 
  const containerVirtualizer = useVirtualizer({
    count: earlierRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    overscan: 15,
  });

  const windowVirtualizer = useWindowVirtualizer({
    count: earlierRows.length,
    estimateSize: () => 120,
    scrollMargin: parentRef.current
      ? parentRef.current.getBoundingClientRect().top + window.scrollY
      : 0,
    overscan: 15,
  });

  const activeVirtualizer = isMobile ? windowVirtualizer : containerVirtualizer;
  const virtualItems = activeVirtualizer.getVirtualItems();

  // Add your scroll listening hook execution at the bottom of the list array maps:
  useEffect(() => {
    const [lastItem] = activeVirtualizer.getVirtualItems().slice(-1);
    if (!lastItem) return;

    if (lastItem.index >= earlierRows.length - 1) {
      // 🚀 This is the exact moment you'll fetch the next page!
      // fetchNextPage()
      console.log('Hit bottom boundary limit! Loading next entries...');
    }
  }, [activeVirtualizer.getVirtualItems(), earlierRows.length]);

  const hasTodayItems = todayRows.length > 0;
  const hasEarlierItems = earlierRows.length > 0;
  const isFilteredListEmpty = filteredData.length === 0;

  if (isLoading) return <VirtualItemSkeleton />;

  return (
    <div className="flex flex-col h-full w-full pt-8 md:overflow-hidden">
      {isModalOpen && (
        <TransactionModal
          type={type}
          mode={modalMode}
          initialData={selectedItem}
          onClose={handleCloseModal}
        />
      )}

      <RemoveDialog
        type={type}
        isOpen={isRemoveDialogOpen}
        onClose={() => {
          setIsRemoveDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
      />

      <main className="flex-1 flex flex-col min-h-0 md:h-full rounded-xl pt-0.5">
        <div
          ref={parentRef}
          className="flex-1 w-full md:overflow-y-auto scrollbar-hide"
          style={{
            // Desktop context requires explicit inner scroll boundary size handling
            height: isMobile ? 'auto' : '100%',
          }}
        >
          {/* Today items block */}
          {hasTodayItems && (
            <div className="mb-6">
              <h2 className="text-[#0B1514] dark:text-[#EAF6F3] font-medium px-1">
                {t('incomeModal.today')}
              </h2>
              <div className="flex flex-col gap-4 mt-4">
                {todayRows.map(item => (
                  <VirtualItem
                    onDelete={handleOpenDelete}
                    onEdit={handleEdit}
                    type={type}
                    item={item}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Earlier items list */}
          <div>
            {hasEarlierItems && (
              <h2 className="text-[#0B1514] dark:text-[#EAF6F3] font-medium px-1">
                {t('incomeModal.earlier')}
              </h2>
            )}
            {earlierRows && (
              <ul
                className="relative w-full mt-4"
                style={{
                  // The container must match the total height to force window scrollbars to appear on mobile
                  height: `${activeVirtualizer.getTotalSize()}px`,
                }}
              >
                {virtualItems.map(virtualRow => {
                  const isLoaderRow = virtualRow.index > earlierRows.length - 1;
                  const item = earlierRows[virtualRow.index];

                  const transformY = isMobile
                    ? virtualRow.start -
                      (windowVirtualizer.options.scrollMargin ?? 0)
                    : virtualRow.start;

                  return (
                    <li
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={activeVirtualizer.measureElement}
                      className="absolute top-0 left-0 w-full pb-4"
                      style={{
                        transform: `translateY(${transformY}px)`,
                      }}
                    >
                      {isLoaderRow ? (
                        <div className="flex justify-center p-4 text-[#02A078] animate-pulse">
                          <Spinner />
                        </div>
                      ) : (
                        item && (
                          <VirtualItem
                            onDelete={handleOpenDelete}
                            item={item}
                            onEdit={handleEdit}
                            type={type}
                            key={item.id}
                          />
                        )
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {isFilteredListEmpty && (
              <NotAvailableTransactions
                isNotLength={transactions.length > 0}
                type={type}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualList;
