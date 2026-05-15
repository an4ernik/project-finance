import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {useEffect, useMemo, useState} from 'react';
import CategoriesManager from './CategoriesManager';
import {Cog, Plus} from 'lucide-react';
import VirtualList from '@/components/VirtualList';
import IncomeModal from '@/pages/income/modal/TransactionModal';
import {CURRENCY_SIGN} from '@/constances/constances';

import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import TransactionFilters from './TransactionFilters';

import {cn} from '@/lib/utils';
import {applyFilters, filtersSchema} from '@/helpers/helpers';
import {
  ALL_CATEGORIES_VALUE,
  type Filters,
  type TransactionUI,
  type TransactionFiltersFormValues,
} from '@/types/types';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';
import FiltersWrapper from '@/components/FiltersWrapper';
import type {GetCategoriesTypeItem} from '@/shared/api/models';
import CreateButtonsWrapper from '@/components/CreateButtonsWrapper'; 

function Income() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const {t} = useTranslation();

  const {data: categoriesResponse} = useGetCategories();
  const {data, isPending:isTransactionsLoading} = useGetTransactions({type: 'INCOME'});

  const categories = useMemo(() => {
    return Array.isArray(categoriesResponse) ? categoriesResponse : [];
  }, [categoriesResponse]);

  const categoriesList = useMemo(() => {
    return categories.filter(
      (category): category is GetCategoriesTypeItem & {name: string} =>
        category.name !== undefined && category.type === 'INCOME',
    );
  }, [categories]);

  const transactions = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(normalizedFilters.search ?? '');
    }, 800);

    return () => clearTimeout(timeout);
  }, [normalizedFilters.search]);

  const totalAmount: number = useMemo(() => {
    return transactions?.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  }, [transactions]);

  const filteredData: TransactionUI[] = useMemo(() => {
    return applyFilters(transactions, normalizedFilters, debouncedSearch);
  }, [transactions, normalizedFilters, debouncedSearch]);
 
  return (
    <AppLayout
      title={t('income.title')}
      subtitle={t('income.subtitle')}
      action={
        <CreateButtonsWrapper>
          <Button
            className="cursor-pointer flex flex-row w-full sm:w-[224px]"
            onClick={() => setIsManageOpen(true)}
            variant="secondary"
          >
            {t('income.actions.manageCategories')}
            <Cog />
          </Button>

          {categoriesList.length === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={categoriesList.length === 0}
                  onClick={() => setIsAddOpen(true)}
                  className="cursor-pointer  w-[224px]"
                >
                  {t(`incomeModal.title.create.${'INCOME'}`)}
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={8}
                className={cn(
                  'relative overflow-visible',
                  'text-[#0B1514] dark:text-[#EAF6F3]',
                  'bg-[#eef3f2] dark:bg-[#122421]',
                  'p-3 rounded-lg shadow-sm',
                )}
              >
                <p className="text-base">{t('tooltipInfo')}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={() => setIsAddOpen(true)}
              className="cursor-pointer sm:w-[224px]"
            >
              {t(`incomeModal.title.create.${'INCOME'}`)}
              <Plus />
            </Button>
          )}
        </CreateButtonsWrapper>
      }
    >
      {isManageOpen && (
        <CategoriesManager type='INCOME' onClose={() => setIsManageOpen(false)} />
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
        <div className="flex justify-between items-center gap-4">
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
      <VirtualList data={filteredData} isTransactionsLength={transactions.length > 0} type="INCOME" isLoading={isTransactionsLoading} />
    </AppLayout>
  );
}

export default Income;
