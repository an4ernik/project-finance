import {formattedAmount} from '@/helpers/helpers';
import {cn} from '@/lib/utils';
import {useTranslation} from 'react-i18next';
import {MONTH_KEYS} from '@/constances/constances';
import type {CustomTooltipProps} from '@/types/types'; 
import { useGetCurrencySign } from '@/shared/store/useCurrencySign';

const tooltipBg = {
  dark: {
    income: {
      start: '#02624ded',
      end: '#04C89E',
    },
    expense: {
      start: '#aa7d00e0',
      end: '#614805',
    },
  },
  light: {
    income: {
      start: '#02A0784D',
      end: '#02A078',
    },
    expense: {
      start: '#FF7C02CC',
      end: '#E6E6E6',
    },
  },
};

const CustomTooltip = ({
  active,
  payload,
  className,
  type = 'cashflow',
  theme = 'light',
}: CustomTooltipProps) => {
  const {t} = useTranslation();
  const CURRENCY_SIGN = useGetCurrencySign();


  if (active && payload && payload.length) {
    const {amount, day, fullDate, name} = payload[0].payload;
    const isYear = MONTH_KEYS.includes(day);

    const currentTheme = theme as keyof typeof tooltipBg;
    const isTransactionType = name === 'EXPENSE' || name === 'INCOME';

    const colors = isTransactionType
      ? tooltipBg[currentTheme][name.toLowerCase() as 'income' | 'expense']
      : null;

    return (
      <div
        className={cn(
          'bg-[#eef3f2] dark:bg-[#122421]',
          'border border-[#dadddd] dark:border-[#1c3f35] py-1 px-6 rounded-lg shadow-2xl outline-none',
          'bg-gradient-to-b from-white to-gray-200 dark:from-[#0B151403] dark:via-[#315F551A] dark:to-[#90D0B60D]',
          className,
          isTransactionType && theme,
        )}
        style={{
          background: colors
            ? `linear-gradient(to bottom, ${colors.start}, ${colors.end})`
            : undefined,
        }}
      >
        {type === 'balance' ? (
          <>
            <p className="text-[#0B1514] dark:text-[#EAF6F3] text-xs font-medium mb-1">
              {isYear
                ? t(`dashboard.dynamicsBalance.months.${day}`)
                : t(`dashboard.dynamicsBalance.days.${day}`)}{' '}
              {fullDate}
            </p>
            <p className="text-[#0B1514] dark:text-[#EAF6F3] text-sm font-bold">
              {formattedAmount(amount)} {CURRENCY_SIGN}
            </p>
          </>
        ) : (
          <>
            <p
              className={cn(
                'text-sm font-bold mb-1',
                isTransactionType
                  ? 'text-[#0B1514] dark:text-[#EAF6F3]'
                  : 'text-[#3A4A48] dark:text-[#BFD9D2]',
              )}
            >
              {t(`dashboard.labels.${name}`)}
            </p>
            <p
              className={cn(
                'text-xs font-medium',
                isTransactionType
                  ? 'text-[#0B1514] dark:text-[#EAF6F3]'
                  : 'text-[#0B1514] dark:text-[#EAF6F3]',
              )}
            >
              {formattedAmount(amount)} {CURRENCY_SIGN}
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
