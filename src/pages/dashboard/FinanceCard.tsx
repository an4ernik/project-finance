import {formattedAmount} from '@/helpers/helpers';
import {cn} from '@/lib/utils';
import {CURRENCY_SIGN} from '@/constances/constances';

import {TrendingUp, TrendingDown, Wallet} from 'lucide-react';
import {useTranslation} from 'react-i18next'; 

interface CardProps {
  type: 'INCOME' | 'EXPENSE' | 'BALANCE';
  total: number; 
}

export function FinanceCard({type, total}: CardProps) {
  const {t} = useTranslation();

  const variant =
    type === 'INCOME' ? 'green' : type === 'EXPENSE' ? 'yellow' : 'teal';

  const variants = {
    green: {
      bg: 'from-[#02A0784D] via-[#02A07880] to-[#02A078CC] dark:from-[#02A0784D] dark:to-[#04C89E]',
      border: 'border-[#02A078] dark:border-[#02A078]',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]',
      iconBg:
        'shadow shadow-sm bg-[#005E4633] dark:bg-linear-to-b dark:from-[#02624D99] dark:to-[#04C89E] dark:border-linear-to-t border border-[#005E46] dark:border-[#02624D99]',
      iconColor: 'text-[#005E46] dark:text-[#E6E6E6]',
      titleColor: 'text-[#0B1514] dark:text-[#EAF6F3]',
      subTitleColor: 'text-[#3A4A48] dark:text-[#EAF6F3]',
      amountColor: 'text-[#0B1514] dark:text-[#EAF6F3]',
    },
    yellow: {
      bg: 'bg-linear-to-b from-[#E6E6E6] to-[#FF7C02CC]  dark:bg-none dark:bg-[#AA7D0033]',
      border: 'border-[#FF7C02CC] dark:border-[#AA7D00]',
      glow: 'shadow-[0_0_25px_rgba(234,179,8,0.2)]',
      iconBg:
        'shadow shadow-sm bg-[#E6E6E6] dark:bg-[#AA7D0033] border border-[#005E4633] dark:border-[#AA7D00]',
      iconColor: 'text-[#FF7C02CC] dark:text-[#AA7D00]',
      titleColor: 'text-[#0B1514] dark:text-[#EAF6F3]',
      subTitleColor: 'text-[#0B1514] dark:text-[#7F9E97]',
      amountColor: 'text-[#0B1514] dark:text-[#EAF6F3]',
    },
    teal: {
      bg: 'bg-linear-to-b from-[#0B151403] via-[#315F551A] to-[#90D0B60D] dark:bg-linear-to-b dark:from-[#0B151403] dark:via-[#315F551A] dark:to-[#02A078CC]',
      border: 'border-[#00AA85] dark:border-[#00AA85]',
      glow: 'shadow-[0_0_25px_rgba(20,184,166,0.2)]',
      iconBg:
        'shadow shadow-sm bg-[#005E4633] dark:bg-[#00AA854D] border border-[#005E46] dark:border-[#00AA85]',
      iconColor: 'text-[#005E46] dark:text-[#E6E6E6]',
      titleColor: 'dark:text-[#EAF6F3]',
      subTitleColor: 'dark:text-[#EAF6F3]',
      amountColor: 'text-[#0B1514] dark:text-[#E6E6E6]',
    },
  } as const;

  const theme = variants[variant];
  const Icon =
    type === 'INCOME' ? TrendingUp : type === 'EXPENSE' ? TrendingDown : Wallet;

  return (
    <div
      className={cn(
        'p-4 rounded-xl border flex flex-col justify-between transition-all duration-300',
        'bg-gradient-to-b h-full w-full',
        theme.bg,
        theme.border,
      )}
    >
      <div className="flex justify-between items-start mb-4 flex-wrap">
        <span className="text-base font-medium pr-2">
          {t(`dashboard.labels.${type}`)}
        </span>

        <div className={cn('p-2 rounded-lg shrink-0', theme.iconBg)}>
          <Icon className={cn(theme.iconColor, 'size-6 sm:size-7')} />
        </div>
      </div>

      <div>
        <div
          className={cn('text-2xl font-bold tracking-tight break-words', theme.amountColor)}
        >
          {total ? formattedAmount(total) : '0'} {CURRENCY_SIGN}
        </div>

        <div className={cn('text-xs mt-1 font-medium', theme.subTitleColor)}>
            <span>{t(`dashboard.thisMonth`)}</span>
        </div>
      </div>
    </div>
  );
}
