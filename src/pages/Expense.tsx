import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {useEffect, useMemo, useState} from 'react';
import CategoriesManager from './income/CategoriesManager';
import {Cog, Plus} from 'lucide-react';
import VirtualList from '@/components/VirtualList';

import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import TransactionFilters from './income/TransactionFilters';
import {cn} from '@/lib/utils';
import {applyFilters, filtersSchema, formattedAmount} from '@/helpers/helpers';

import {
  ALL_CATEGORIES_VALUE,
  type Filters,
  type TransactionFiltersFormValues,
  type TransactionUI,
} from '@/types/types';

import TransactionModal from '@/pages/income/modal/TransactionModal';
import {CURRENCY_SIGN} from '@/constances/constances';
import FiltersWrapper from '@/components/FiltersWrapper';
import {GetCategoriesTypeItem} from '@/shared/api/models';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';
import CreateButtonsWrapper from '@/components/CreateButtonsWrapper';

function Expense() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const {t} = useTranslation();

  const {data: categoriesResponse} = useGetCategories();
  const {data} = useGetTransactions({type: 'EXPENSE'});

  const categories = useMemo(() => {
    return Array.isArray(categoriesResponse) ? categoriesResponse : [];
  }, [categoriesResponse]);

  const categoriesList = useMemo(() => {
    return categories.filter(
      (category): category is GetCategoriesTypeItem & {name: string} =>
        category.name !== undefined && category.type === 'EXPENSE',
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
        <CreateButtonsWrapper>
          <Button
            variant="secondary"
            className="cursor-pointer flex flex-row sm:w-[224px]"
            onClick={() => setIsManageOpen(true)}
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
                  {t(`incomeModal.title.create.${'EXPENSE'}`)}
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
              {t(`incomeModal.title.create.${'EXPENSE'}`)}
              <Plus />
            </Button>
          )}
        </CreateButtonsWrapper>
      }
    >
      {isManageOpen && (
        <CategoriesManager
          type={GetCategoriesTypeItem.EXPENSE}
          onClose={() => setIsManageOpen(false)}
        />
      )}

      {isAddOpen && (
        <TransactionModal
          type="EXPENSE"
          mode="create"
          onClose={() => setIsAddOpen(false)}
        />
      )}
      <FiltersWrapper>
        <TransactionFilters type="EXPENSE" form={form} />
        <div className="flex justify-between items-center">
          <span className="dark:text-[#BFD9D2]">
            {t('incomeModal.filters.total.EXPENSE')}
          </span>
          <div
            className={cn(
              'flex items-baseline gap-[10px] text-[24px] font-semibold text-[#FF7C02CC] dark:text-[#AA7D00]',
            )}
          >
            <span>{formattedAmount(totalAmount) || '0'}</span>
            <span>{CURRENCY_SIGN}</span>
          </div>
        </div>
      </FiltersWrapper>
      <VirtualList type="EXPENSE" data={filteredData} />
    </AppLayout>
  );
}

export default Expense;
