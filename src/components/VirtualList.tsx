import {useRef, useState, useEffect, useLayoutEffect, useMemo} from 'react';
import {useVirtualizer} from '@tanstack/react-virtual';

import VirtualItem from './VirtualItem';
import Spinner from './Spinner';
import {t} from 'i18next';
import {toast} from 'sonner';
import {useDeleteTransaction} from '@/shared/api/generated/transaction-management/transaction-management';
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
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import type {TransactionCursorRequest} from '@/shared/api/models/transactionCursorRequest';
import {api} from '@/shared/api/axios';
import {format} from 'date-fns';
import {cn} from '@/lib/utils';

interface VirtualListProps {
  type: 'INCOME' | 'EXPENSE';
  formFilters: TransactionFiltersFormValues;
  setTotalAmount: (amount: number) => void;
}

const LIMIT = 20;

type TransactionsPage = {
  data?: Item[];
  transactions?: Item[];
  nextCursor?: string;
};

const VirtualList = ({type, formFilters, setTotalAmount}: VirtualListProps) => {
  const queryClient = useQueryClient();

  const isCustomPeriodIncomplete =
    (!!formFilters.fromDate && !formFilters.toDate) ||
    (!formFilters.fromDate && !!formFilters.toDate);

  const mutationConfig = {
    mutation: {
      onSuccess: () => {
        queryClient.resetQueries({
          queryKey: ['/api/v1/transactions'],
          exact: false,
        });
      },
    },
  };

  const {
    data,
    isPending: isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      '/api/v1/transactions',
      type,
      formFilters.fromDate,
      formFilters.toDate,
    ],

    initialPageParam: undefined as string | undefined,

    queryFn: async ({pageParam}: {pageParam?: string}) => {
      const requestParams: TransactionCursorRequest = {
        type,
        limit: LIMIT,
        cursor: pageParam,
        dateFrom: formFilters?.fromDate
          ? format(formFilters.fromDate, 'yyyy-MM-dd')
          : undefined,
        dateTo: formFilters?.toDate
          ? format(formFilters.toDate, 'yyyy-MM-dd')
          : undefined,
      };

      const response = await api.get<TransactionsPage>('/api/v1/transactions', {
        params: requestParams,
        withCredentials: true,
      });

      return response.data;
    },

    enabled: !isCustomPeriodIncomplete,
    getNextPageParam: lastPage => {
      return lastPage?.nextCursor ?? undefined;
    },

    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const {mutateAsync: deleteIncome} = useDeleteTransaction(mutationConfig);

  const parentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [listScrollMargin, setListScrollMargin] = useState(0);
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

  const transactions = useMemo<TransactionUI[]>(() => {
    if (!data?.pages) return [];
    const pageItems = data.pages.flatMap(page => {
      // Якщо сервер повертає масив прямо в page.data:
      if (Array.isArray(page?.data)) return page.data;
      // Якщо сервер повертає об'єкт типу { transactions: [...] }:
      if (Array.isArray(page?.transactions)) return page.transactions;
      return [];
    });

    return pageItems.map(item => ({
      ...item,
      category: {
        ...item.category,
        type: item.category.type ?? item.type ?? type,
      },
      intervalUnit: item.intervalUnit as IntervalUnitType | undefined,
    }));
  }, [data, type]);

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

  const totalRowsCount = earlierRows.length + (hasNextPage ? 1 : 0);
  const hasTodayItems = todayRows.length > 0;
  const hasEarlierItems = earlierRows.length > 0;
  const isFilteredListEmpty = filteredData.length === 0;

  useLayoutEffect(() => {
    const parent = parentRef.current;
    const list = listRef.current;
    if (!parent || !list) return;

    const updateListScrollMargin = () => {
      const parentRect = parent.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      setListScrollMargin(listRect.top - parentRect.top + parent.scrollTop);
    };

    updateListScrollMargin();

    const resizeObserver = new ResizeObserver(updateListScrollMargin);
    resizeObserver.observe(parent);
    resizeObserver.observe(list);
    window.addEventListener('resize', updateListScrollMargin);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateListScrollMargin);
    };
  }, [hasTodayItems, hasEarlierItems, todayRows.length, earlierRows.length]);

  const rowVirtualizer = useVirtualizer({
    count: totalRowsCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    scrollMargin: listScrollMargin,
    overscan: 6,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const virtualRows = rowVirtualizer.getVirtualItems();
    if (virtualRows.length === 0) return;

    const lastItem = virtualRows[virtualRows.length - 1];

    if (
      lastItem.index >= earlierRows.length &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    rowVirtualizer,
    earlierRows.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  if (isLoading && !isFetchingNextPage) return <VirtualItemSkeleton />;

  return (
    <div className="flex flex-col h-[100svh] w-full pt-8 md:h-full md:overflow-hidden">
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
          className="flex-1 w-full min-h-0 overflow-y-auto scrollbar-hide"
        >
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

          <div>
            {hasEarlierItems && (
              <h2 className="text-[#0B1514] dark:text-[#EAF6F3] font-medium px-1">
                {t('incomeModal.earlier')}
              </h2>
            )}
            {earlierRows && (
              <ul
                ref={listRef}
                className={cn('relative w-full mt-4')}
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {virtualItems.map(virtualRow => {
                  const isLoaderRow = virtualRow.index > earlierRows.length - 1;
                  const item = earlierRows[virtualRow.index];

                  return (
                    <li
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      className="absolute top-0 left-0 w-full pb-4"
                      style={{
                        transform: `translateY(${
                          virtualRow.start - listScrollMargin
                        }px)`,
                      }}
                    >
                      {isLoaderRow ? (
                        <div className="flex justify-center items-center p-6 w-full text-[#02A078]">
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
