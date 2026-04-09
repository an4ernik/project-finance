import {useEffect, useRef, useState} from 'react';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useTranslation} from 'react-i18next';

import {
  DollarSign,
  TrendingUp,
  MonitorCheck,
  Percent,
  type LucideIcon,
} from 'lucide-react';

import {Label} from './ui/label';
import VirtualItem from './VirtualItem';

type ActivityValue =
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'cashback'
  | 'monthly'
  | 'yearly';

interface Activity {
  val: ActivityValue;
  icon: LucideIcon;
  isRepeat: ActivityValue | false;
}

const INCOME_TYPES: Activity[] = [
  {val: 'salary', icon: DollarSign, isRepeat: 'yearly'},
  {val: 'freelance', icon: MonitorCheck, isRepeat: 'monthly'},
  {val: 'investments', icon: Percent, isRepeat: 'monthly'},
  {val: 'cashback', icon: TrendingUp, isRepeat: false},
];

export const MOCK_PAGES = Array.from({length: 3}).map((_, pageIndex) => ({
  items: Array.from({length: 100}).map((_, i) => {
    // Вибираємо рандомний тип з INCOME_TYPES
    const randomType =
      INCOME_TYPES[Math.floor(Math.random() * INCOME_TYPES.length)];
    const id = (pageIndex + 1) * 100 + i;

    return {
      id: `${pageIndex + 1}-${i}`,
      name: `${randomType.val.charAt(0).toUpperCase() + randomType.val.slice(1)} #${id}`,
      amount: (Math.random() * 5000 + 100).toFixed(2), // Випадкова сума
      category: randomType.val,
      Icon: randomType.icon,
      isRepeat: randomType.isRepeat,
      // Рандомна дата в межах останнього місяця
      date: new Date(2026, 3, Math.floor(Math.random() * 30) + 1),
    };
  }),
  nextCursor: pageIndex < 2 ? pageIndex + 2 : null,
}));

export function VirtualList() {
  const {t} = useTranslation();
  // 1. Створюємо реф для контейнера, який скролиться
  const parentRef = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState(MOCK_PAGES.slice(0, 1));
  const [isFetching, setIsFetching] = useState(false);

  // Перетворюємо [[p1], [p2]] у [p1, p2] для віртуалізатора
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

  // Функція завантаження наступної сторінки
  const fetchNextPage = () => {
    if (isFetching || !hasNextPage) return;
    setIsFetching(true);

    // Імітуємо запит до API
    setTimeout(() => {
      setPages(prev => [...prev, MOCK_PAGES[prev.length]]);
      setIsFetching(false);
    }, 1000);
  };

  // 2. Ініціалізуємо віртуалізатор
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length, // +1 для лоадера
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
      <main className="flex-1 flex flex-col min-h-0 ">
        <div
          ref={parentRef}
          className="flex-1 w-full overflow-auto scrollbar-hide"
          style={{height: `${rowVirtualizer.getTotalSize()}px`}}
        >
          {/* today items */}
          <div>
            <Label className="text-[#0B1514] dark:text-[#EAF6F3]">Today</Label>
            <div className="flex flex-col gap-4 mt-4">
              {todayRows.length > 0 &&
                todayRows.map(item => {
                  return (
                    <VirtualItem type="income" item={item} key={item.id} />
                  );
                })}
            </div>
          </div>

          {/* list     */}
          <div className="mt-6">
            <Label className="text-[#0B1514] dark:text-[#EAF6F3]">
              Tomorrow
            </Label>
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
                    data-index={virtualRow.index} // ВАЖЛИВО для вимірювання
                    ref={rowVirtualizer.measureElement}
                    className="absolute top-0 left-0 w-full pb-4"
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoaderRow ? (
                      <div className="flex justify-center p-4 text-[#02A078] animate-pulse">
                        Завантаження...
                      </div>
                    ) : ( 
                      <VirtualItem
                        item={item} 
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
