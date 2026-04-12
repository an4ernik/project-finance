import {useEffect, useRef, useState} from 'react';
import {useVirtualizer} from '@tanstack/react-virtual';
import IncomeModal from '@/pages/income/modal/IncomeModal';

import {Label} from './ui/label';
import VirtualItem from './VirtualItem';
import Spinner from './Spinner';
import {INCOME_CATEGORY_OPTIONS} from '@/pages/income/modal/incomeCategoryOptions';
import {t} from 'i18next'; 
import {TrendingUp} from 'lucide-react';
import {cn} from '@/lib/utils';

const REPEAT_TYPES = ['yearly', 'monthly', 'once'];

export const MOCK_PAGES = Array.from({length: 3}).map((_, pageIndex) => ({
  items: Array.from({length: 100}).map((_, i) => {
    const typeIndex = (pageIndex + i) % INCOME_CATEGORY_OPTIONS.length;
    const randomType = INCOME_CATEGORY_OPTIONS[typeIndex];
    const randomRepeat =
      REPEAT_TYPES[Math.floor(Math.random() * REPEAT_TYPES.length)];

    const id = (pageIndex + 1) * 100 + i;

    return {
      id,
      name: `${randomType.val.charAt(0).toUpperCase() + randomType.val.slice(1)} #${id}`,
      amount: (1000 + ((id * 7.5) % 4000)).toFixed(2),
      categoryId: randomType.id,
      Icon: randomType.icon,
      isRepeat: randomRepeat,
      date: new Date(2026, 3, (i % 28) + 1),
    };
  }),
  nextCursor: pageIndex < 2 ? pageIndex + 2 : null,
}));

const VirtualList = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');

  const handleEdit = (item: any) => {
    setSelectedItem({
      id: item.id,
      amount: Number(item.amount),
      categoryId: item.categoryId,
      date: item.date,
      description: item.name,
      isRepeat: item.isRepeat,
    });
    setModalMode('update');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const [pages, setPages] = useState(MOCK_PAGES.slice(0, 1));
  const [isFetching, setIsFetching] = useState(false);

  const allRows = pages.flatMap(page => page.items);
  const hasNextPage = pages[pages.length - 1].nextCursor !== null;

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayRows = allRows.filter(item => isToday(new Date(item.date)));
 

  const fetchNextPage = () => {
    if (isFetching || !hasNextPage) return;
    setIsFetching(true);

    setTimeout(() => {
      setPages(prev => [...prev, MOCK_PAGES[prev.length]]);
      setIsFetching(false);
    }, 1000);
  };

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 128,
    measureElement: el => el.getBoundingClientRect().height,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= allRows.length - 1 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [virtualItems, allRows.length, hasNextPage, isFetching]);

  return (
    <div className="flex flex-col h-4/5 w-full pt-8">
      {isModalOpen && (
        <IncomeModal
          mode={modalMode}
          initialData={selectedItem}
          onClose={handleCloseModal}
        />
      )}
      <main className="flex-1 flex flex-col min-h-0 ">
        <div
          ref={parentRef}
          className="flex-1 w-full overflow-auto scrollbar-hide"
          style={{height: `${rowVirtualizer.getTotalSize()}px`}}
        >
          {/* today items */}
          {todayRows && todayRows?.length > 0 && (
            <div>
              <Label className="text-[#0B1514] dark:text-[#EAF6F3]">
                {t('incomeModal.today')}
              </Label>
              <div className="flex flex-col gap-4 mt-4">
                {todayRows.length > 0 &&
                  todayRows.map(item => {
                    return (
                      <VirtualItem
                        onEdit={handleEdit}
                        type="income"
                        item={item}
                        key={item.id}
                      />
                    );
                  })}
              </div>
            </div>
          )}

          {/* list     */}
          <div className="mt-6">
            {virtualItems && virtualItems?.length > 0 && (
              <Label className="text-[#0B1514] dark:text-[#EAF6F3]">
                {t('incomeModal.earlier')}
              </Label>
            )}
            {virtualItems && virtualItems?.length > 0 ? (
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
                        <VirtualItem item={item} onEdit={handleEdit} />
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div
                className={cn(
                  'flex flex-col gap-4 mt-4 w-full h-full justify-center items-center mb-20',
                )}
              >
                <div
                  className={cn(
                    'flex justify-center items-center size-20 rounded-lg border p-4 transition-all shadow-md',
                    'bg-linear-to-b from-[#0B151403] via-[#315F551A] to-[#90D0B60D] backdrop-blur-sm',
                    'border-[#9AA7A5] shadow-[#4B4B4B40]',
                    'dark:border-[#183f35] dark:shadow-[#1d2f1c]',
                  )}
                >
                  <TrendingUp className="text-[#9AA7A5] dark:text-[#7F9E97]" />
                </div>
                <Label className="text-[#0B1514] dark:text-[#EAF6F3] text-[20px] font-medium">
                  {t('incomeModal.noIncome')}
                </Label>
                <span className={cn('text-[#6F7E7C] dark:text-[#7F9E97]')}>
                  {t('incomeModal.noIncomeSubText')}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualList;
