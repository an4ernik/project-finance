import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Cog, Plus} from 'lucide-react';

import AppLayout from '@/layouts/AppLayout';
import {Button} from '@/components/ui/button';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import FiltersWrapper from '@/components/FiltersWrapper';
import CreateButtonsWrapper from '@/components/CreateButtonsWrapper';
import VirtualList from '@/components/VirtualList';

import CategoriesManager from '../pages/income/CategoriesManager'; // Or a shared folder path
import TransactionFilters from '../pages/income/TransactionFilters';
import TransactionModal from '@/pages/income/modal/TransactionModal';

import {cn} from '@/lib/utils';
import {filtersSchema, formattedAmount} from '@/helpers/helpers';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';
import {GetCategoriesTypeItem} from '@/shared/api/models';
import {
  ALL_CATEGORIES_VALUE,
  type TransactionFiltersFormValues,
} from '@/types/types';
import {useGetCurrencySign} from '@/shared/store/useCurrencySign';

interface TransactionsPageTemplateProps {
  type: 'INCOME' | 'EXPENSE';
}

export function TransactionsPageTemplate({
  type,
}: TransactionsPageTemplateProps) {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const CURRENCY_SIGN = useGetCurrencySign();

  const {t} = useTranslation();
  const {data: categoriesResponse} = useGetCategories();

  const lowercaseType = type.toLowerCase();

  const categoriesList = useMemo(() => {
    const categories = Array.isArray(categoriesResponse)
      ? categoriesResponse
      : [];
    return categories.filter(
      (category): category is GetCategoriesTypeItem & {name: string} =>
        category.name !== undefined && category.type === type,
    );
  }, [categoriesResponse, type]);

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

  // Dynamic theme colors for the Total balance text indicator
  const totalColorClass =
    type === 'INCOME'
      ? 'text-[#00AA85]'
      : 'text-[#FF7C02CC] dark:text-[#AA7D00]';
 
  return (
    <AppLayout 
      title={t(`${lowercaseType}.title`)}
      subtitle={t(`${lowercaseType}.subtitle`)}
      className={cn(isManageOpen ? 'overflow-hidden' : 'overflow-y-auto', 'scrollbar-hide')}
      action={
        <CreateButtonsWrapper>
          <Button
            variant="secondary"
            className="cursor-pointer flex flex-row w-full sm:w-[224px]"
            onClick={() => setIsManageOpen(true)}
          >
            {t(`${lowercaseType}.actions.manageCategories`)}
            <Cog />
          </Button>

          {categoriesList.length === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled
                  onClick={() => setIsAddOpen(true)}
                  className="cursor-pointer w-full sm:w-[224px]"
                >
                  {t(`incomeModal.title.create.${type}`)}
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={8}
                className={cn(
                  'relative overflow-visible p-3 rounded-lg shadow-sm',
                  'border text-[#3A4A48] dark:text-[#BFD9D2] bg-[#fafafa] fill-[#eef3f2] dark:bg-[#0f453c]',
                )}
              >
                <p className="text-sm">{t('tooltipInfo')}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={() => setIsAddOpen(true)}
              className="cursor-pointer w-full sm:w-[224px]"
            >
              {t(`incomeModal.title.create.${type}`)}
              <Plus />
            </Button>
          )}
        </CreateButtonsWrapper>
      }
    >
      {isManageOpen && (
        <CategoriesManager type={type} onClose={() => setIsManageOpen(false)} />
      )}

      {isAddOpen && (
        <TransactionModal
          type={type}
          mode="create"
          onClose={() => setIsAddOpen(false)}
        />
      )}

      <FiltersWrapper>
        <TransactionFilters type={type} form={form} />
        <div className="flex justify-between items-center min-w-[140px] gap-4 flex-wrap">
          <span className="dark:text-[#BFD9D2]">
            {t(`incomeModal.filters.total.${type}`)}
          </span>
          <div
            className={cn(
              'flex items-center justify-end gap-2.5 text-[24px] font-semibold min-w-0',
              totalColorClass,
            )}
          >
            <span className="break-all min-w-0">
              {formattedAmount(totalAmount) || '0'} 
            </span>
            <span className="shrink-0 self-end">{CURRENCY_SIGN}</span>
          </div>
        </div>
      </FiltersWrapper>

      <VirtualList
        type={type}
        formFilters={filters}
        setTotalAmount={setTotalAmount}
      />
    </AppLayout>
  );
}
