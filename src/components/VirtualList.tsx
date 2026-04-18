import {useRef, useState} from 'react';
import {useVirtualizer} from '@tanstack/react-virtual';
import IncomeModal from '@/pages/income/modal/TransactionModal';

import VirtualItem from './VirtualItem';
import Spinner from './Spinner';
import {t} from 'i18next';
import {toast} from 'sonner';
import {useDeleteTransaction} from '@/shared/api/generated/transaction-management/transaction-management';
import RemoveDialog from '@/pages/income/modal/RemoveDialog';
import NotAvailableTransactions from './NotAvailableTransactions';
import type {Props, Transaction, TransactionUI} from '@/types/types';

const VirtualList = ({data, type}: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransactionUI | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('update');

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Transaction | null>(null);

  const {mutateAsync: deleteIncome} = useDeleteTransaction();

  const handleConfirmDelete = async (id: number) => {
    try {
      await deleteIncome({transactionId: id});

      toast.success(t(`incomeModal.transaction.success.delete.${type}`));
    } catch (error) {
      console.error(error);
      toast.error(t(`incomeModal.transaction.error.delete.${type}`));
    } finally {
      setIsRemoveDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleOpenDelete = (item: Transaction) => {
    setItemToDelete(item);
    setIsRemoveDialogOpen(true);
  };

  const handleEdit = (item: TransactionUI) => {
    setSelectedItem({
      id: item.id,
      amount: Number(item.amount),
      categoryId: item.categoryId,
      date: item.date,
      description: item.description,
      isRepeat: item.isRepeat,
      Icon: item.Icon,
    });
    setModalMode('update');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const allRows = data;

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayRows = allRows.filter(item => isToday(new Date(item.date)));
  const earlierRows = allRows.filter(item => !isToday(new Date(item.date)));

  const rowVirtualizer = useVirtualizer({
    count: earlierRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 15,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="flex flex-col h-full sm:h-4/6 w-full pt-8 overflow-hidden">
      {isModalOpen && (
        <IncomeModal
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
      <main className="flex-1 flex flex-col min-h-0 rounded-xl pt-0.5 overflow-hidden">
        <div
          ref={parentRef}
          className="flex-1 w-full overflow-auto scrollbar-hide "
          style={{height: `${rowVirtualizer.getTotalSize()}px`}}
        >
          {/* today items */}
          {todayRows && todayRows?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[#0B1514] dark:text-[#EAF6F3]">
                {t('incomeModal.today')}
              </h2>
              <div className="flex flex-col gap-4 mt-4">
                {todayRows.length > 0 &&
                  todayRows.map(item => {
                    return (
                      <VirtualItem
                        onDelete={handleOpenDelete}
                        onEdit={handleEdit}
                        type={type}
                        item={item}
                        key={item.id}
                      />
                    );
                  })}
              </div>
            </div>
          )}

          {/* list */}
          <div>
            {virtualItems && virtualItems?.length > 0 && (
              <h2 className="text-[#0B1514] dark:text-[#EAF6F3]">
                {t('incomeModal.earlier')}
              </h2>
            )}
            {(virtualItems && virtualItems?.length > 0) ||
            (todayRows && todayRows?.length > 0) ? (
              <ul
                className="relative w-full mt-4!"
                style={{height: `${rowVirtualizer.getTotalSize()}px`}}
              >
                {virtualItems.map(virtualRow => {
                  const isLoaderRow = virtualRow.index > allRows.length - 1;
                  const item = allRows[virtualRow.index];

                  return (
                    <li
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      className="absolute top-0 left-0 w-full pb-4"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {isLoaderRow ? (
                        <div className="flex justify-center p-4 text-[#02A078] animate-pulse">
                          <Spinner />
                        </div>
                      ) : (
                        <VirtualItem
                          onDelete={handleOpenDelete}
                          item={item}
                          onEdit={handleEdit}
                          type={type}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <NotAvailableTransactions type={type} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualList;
