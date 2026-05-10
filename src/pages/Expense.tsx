import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import CategoriesManager from './income/CategoriesManager';
import {Cog, Plus} from 'lucide-react';
import VirtualList from '@/components/VirtualList';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import z from 'zod';

import TransactionFilters from './income/TransactionFilters';
import {cn} from '@/lib/utils';
import {formattedAmount} from '@/helpers/helpers';
import {
  ALL_CATEGORIES_VALUE,
  type TransactionFiltersFormValues,
} from '@/types/types';
import TransactionModal from '@/pages/income/modal/TransactionModal';
import {CURRENCY_SIGN} from '@/constances/constances';
import FiltersWrapper from '@/components/FiltersWrapper';

function Expense() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {t} = useTranslation();

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

  const totalAmount = 5500;

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
            {t(`incomeModal.title.create.${'EXPENSE'}`)}
            <Plus />
          </Button>
        </div>
      }
    >
      {isManageOpen && (
        <CategoriesManager
          onClose={() => setIsManageOpen(false)}
          type="EXPENSE"
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
      <VirtualList type="EXPENSE" />
    </AppLayout>
  );
}

export default Expense;
