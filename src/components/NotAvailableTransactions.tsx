import {cn} from '@/lib/utils';
import {TrendingUp, TrendingDown, ScanSearch} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import type {TransactionType} from '@/types/types';

type Props = {
  type: TransactionType;
  isNotLength?: boolean | undefined;
};

const NotAvailableTransactions = ({type, isNotLength}: Props) => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col gap-4 mt-10 w-full h-full justify-center items-center mb-20">
      {/* Icon Container */}
      <div
        className={cn(
          'flex justify-center items-center size-20 rounded-lg border p-4 transition-all shadow-md',
          'bg-linear-to-b from-[#0B151403] via-[#315F551A] to-[#90D0B60D] backdrop-blur-sm',
          'border-[#9AA7A5] shadow-[#4B4B4B40]',
          'dark:border-[#183f35] dark:shadow-[#1d2f1c]',
        )}
      >
        {isNotLength ? (
          // Show only ScanSearch if there is no length/data
          <ScanSearch className="text-[#9AA7A5] dark:text-[#7F9E97] size-9" />
        ) : type === 'INCOME' ? (
          // Show TrendingUp only if type is INCOME and data exists
          <TrendingUp className="text-[#9AA7A5] dark:text-[#7F9E97] size-9" />
        ) : (
          // Show TrendingDown only if type is EXPENSE and data exists
          <TrendingDown className="text-[#9AA7A5] dark:text-[#7F9E97] size-9" />
        )}
      </div>
      {/* Text Content */}
      <h2 className="text-[#0B1514] dark:text-[#EAF6F3] text-[20px] font-medium text-center">
        {isNotLength
          ? t(`incomeModal.empty.notFoundTitle`)
          : t(`incomeModal.empty.${type}.title`)}
      </h2>
      <span className={cn('text-[#6F7E7C] dark:text-[#7F9E97] text-center')}>
        {isNotLength
          ? t(`incomeModal.empty.notFoundSubtitle`)
          : t(`incomeModal.empty.${type}.description`)}
      </span>
    </div>
  );
};

export default NotAvailableTransactions;
