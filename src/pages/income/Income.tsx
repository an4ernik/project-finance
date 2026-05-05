import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {useEffect, useMemo, useState} from 'react';
import CategoriesManager from './CategoriesManager';
import {Cog, Plus} from 'lucide-react';
import VirtualList from '@/components/VirtualList';
import IncomeModal from '@/pages/income/modal/TransactionModal';
import {CURRENCY_SIGN} from '@/constances/constances';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import z from 'zod';
import TransactionFilters from './TransactionFilters';

import {cn} from '@/lib/utils';
import {applyFilters} from '@/helpers/helpers';
import {
  ALL_CATEGORIES_VALUE,
  type Filters,
  type TransactionUI,
  type TransactionFiltersFormValues,
} from '@/types/types';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';
import FiltersWrapper from '@/components/FiltersWrapper';

function Income() {
  const {data} = useGetCategories();
  const categories = Array.isArray(data) ? data : []; 
  const transactionsResponse = useGetTransactions();
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {t} = useTranslation();

  const transactions = useMemo(() => {
    return Array.isArray(transactionsResponse?.data) ? transactionsResponse.data : [];
  }, [transactionsResponse]);

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

  const normalizedFilters: Filters = useMemo(
    () => ({
      period: filters.period ?? 'all',
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      category: filters.category ?? [ALL_CATEGORIES_VALUE],
      search: filters.search ?? '',
    }),
    [
      filters.period,
      filters.fromDate,
      filters.toDate,
      filters.category,
      filters.search,
    ],
  );

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(normalizedFilters.search ?? '');
    }, 800);

    return () => clearTimeout(timeout);
  }, [normalizedFilters.search]);

  const totalAmount: number = useMemo(() => {
    return transactions.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  }, [transactions]);

  const filteredData: TransactionUI[] = useMemo(() => {
    return applyFilters(transactions, normalizedFilters, debouncedSearch);
  }, [transactions, normalizedFilters, debouncedSearch]);

  return (
    <AppLayout
      title={t('income.title')}
      subtitle={t('income.subtitle')}
      action={
        <div
          className={`${isManageOpen && 'hidden md:flex'} flex flex-col md:flex-row gap-[36px] items-center w-full`}
        >
          <Button
            className="cursor-pointer flex flex-row w-full md:w-[224px]"
            onClick={() => setIsManageOpen(true)}
            variant="secondary"
          >
            {t('income.actions.manageCategories')}
            <Cog />
          </Button>
          <Button
            disabled={categories.length === 0}
            className="cursor-pointer w-full md:w-[224px]"
            onClick={() => setIsAddOpen(true)}
          >
            {t('income.actions.addIncome')}
            <Plus />
          </Button>
        </div>
      }
    >
      {isManageOpen && (
        <CategoriesManager onClose={() => setIsManageOpen(false)} />
      )}
      {isAddOpen && (
        <IncomeModal
          type="INCOME"
          mode="create"
          onClose={() => setIsAddOpen(false)}
        />
      )}
      <FiltersWrapper>
        <TransactionFilters type="INCOME" form={form} />
        <div className="flex justify-between items-center">
          <span className="dark:text-[#BFD9D2]">
            {t('incomeModal.filters.total.INCOME')}
          </span>
          <div
            className={cn(
              'flex items-baseline gap-[10px] text-[24px] font-semibold text-[#00AA85]',
            )}
          >
            <span>{totalAmount.toLocaleString('uk-UA')}</span>
            <span>{CURRENCY_SIGN}</span>
          </div>
        </div>
      </FiltersWrapper>
      <VirtualList data={filteredData} type="INCOME" />
    </AppLayout>
  );
}

export default Income;
