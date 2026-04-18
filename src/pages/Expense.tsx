import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import CategoriesManager from './income/CategoriesManager';
import {Cog, Plus} from 'lucide-react';
import VirtualList from '@/components/VirtualList'; 

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import z from 'zod';
 
import TransactionFilters from './income/TransactionFilters';
import {cn} from '@/lib/utils';
import {
  applyFilters,
  formattedAmount,
  TRANSACTION_CATEGORIES,
  REPEAT_TYPES,
  type IncomeFormData,
} from '@/helpers/helpers';
import {
  ALL_CATEGORIES_VALUE,
  type Filters,
  type TransactionFiltersFormValues,
} from '@/types/types';
import TransactionModal from '@/pages/income/modal/TransactionModal';

export const MOCK_PAGES = Array.from({length: 3}).map((_, pageIndex) => ({
  items: Array.from({length: 20}).map((_, i) => {
    const typeIndex =
      (pageIndex + i) % TRANSACTION_CATEGORIES['expense'].length;
    const randomType = TRANSACTION_CATEGORIES['expense'][typeIndex];
    const randomRepeat =
      REPEAT_TYPES[Math.floor(Math.random() * REPEAT_TYPES.length)];

    const id = (pageIndex + 1) * 100 + i;

    return {
      id,
      description: `${randomType.val.charAt(0).toUpperCase() + randomType.val.slice(1)} #${id}`,
      amount: (1000 + ((id * 7.5) % 4000)).toFixed(2),
      categoryId: randomType.id,
      Icon: randomType.icon,
      isRepeat: randomRepeat,
      date: new Date(2026, 3, (i % 28) + 1),
    };
  }),
  nextCursor: pageIndex < 2 ? pageIndex + 2 : null,
}));

function Expense() {
  const [data, setData] = useState<IncomeFormData[]>([]);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {t} = useTranslation();

  const ALL_ITEMS = MOCK_PAGES.flatMap(p => p.items);

  const filtersSchema = z.object({
    period: z
      .enum(['all', 'today', 'week', 'month', 'year', 'custom'])
      .default('all'),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
    category: z.array(z.string()).default([ALL_CATEGORIES_VALUE]),
    search: z.string().default(''),
  });

  const form = useForm<TransactionFiltersFormValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      period: 'all',
      fromDate: undefined,
      toDate: undefined,
      category: [ALL_CATEGORIES_VALUE],
      search: '',
    },
  });

  const filters = form.watch();
  const normalizedFilters: Filters = {
    period: filters.period ?? 'all',
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    category: filters.category ?? [ALL_CATEGORIES_VALUE],
    search: filters.search ?? '',
  };
  const totalAmount = 5500;

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(normalizedFilters.search);
    }, 800);

    return () => clearTimeout(timeout);
  }, [normalizedFilters.search]);

  useEffect(() => {
    setData(applyFilters(ALL_ITEMS, normalizedFilters, debouncedSearch));
  }, [
    normalizedFilters.period,
    normalizedFilters.category,
    normalizedFilters.fromDate,
    normalizedFilters.toDate,
    debouncedSearch,
  ]);
  return (
    <AppLayout
      title={t('income.title')}
      subtitle={t('income.subtitle')}
      action={
        <div className="flex flex-col sm:flex-row gap-[36px]">
          <Button
            className="cursor-pointer flex flex-row w-[224px]"
            onClick={() => setIsManageOpen(true)}
          >
            {t('income.actions.manageCategories')}
            <Cog />
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="cursor-pointer  w-[224px]"
          >
            {t(`incomeModal.title.create.${'expense'}`)}
            <Plus />
          </Button>
        </div>
      }
    >
      {isManageOpen && (
        <CategoriesManager onClose={() => setIsManageOpen(false)} />
      )}

      {isAddOpen && (
        <TransactionModal
          type="expense"
          mode="create"
          onClose={() => setIsAddOpen(false)}
        />
      )}
      <div className="w-full h-auto rounded-[16px] p-6 bg-secondary flex flex-col gap-7">
        <TransactionFilters type="expense" form={form} />
        <div className="flex justify-between items-center">
          <span className="dark:text-[#BFD9D2]">
            {t('incomeModal.filters.total.expense')}
          </span>
          <div
            className={cn(
              'flex items-baseline gap-[10px] text-[24px] font-semibold text-[#FF7C02CC] dark:text-[#AA7D00]',
            )}
          >
            <span>{formattedAmount(totalAmount) || '0'}</span>
            <span>₴</span>
          </div>
        </div>
      </div>
      <VirtualList data={data} type="expense" />
    </AppLayout>
  );
}

export default Expense;
