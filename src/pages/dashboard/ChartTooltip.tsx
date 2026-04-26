import {formattedAmount} from '@/helpers/helpers';
import {cn} from '@/lib/utils';
import {useTranslation} from 'react-i18next';
import {CURRENCY_SIGN} from '@/constances/constances';
import type { CustomTooltipProps } from '@/types/types';
 
const CustomTooltip = ({
  active,
  payload,
  className,
  type='cashflow',
}: CustomTooltipProps) => {
  const {t} = useTranslation();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const key = payload[0].payload.name;
    return (
      <div
        className={cn(
          'bg-[#eef3f2] dark:bg-[#122421]',
          'border border-[#dadddd] dark:border-[#1c3f35] p-3 rounded-lg shadow-2xl outline-none',
          'bg-gradient-to-b from-white to-gray-200 dark:from-white/5 dark:to-gray-800/50',
          className,
        )}
      >
        {type === 'balance' ? (
          <>
            <p className="text-[#0B1514] dark:text-[#EAF6F3] text-xs font-medium mb-1">
              {t(`dashboard.dynamicsBalance.days.${data.day.toLocaleString()}`)} {data.fullDate}
            </p>
            <p className="text-[#0B1514] dark:text-[#EAF6F3] text-sm font-bold">
              {data.value.toLocaleString()} {CURRENCY_SIGN} 
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-[#3A4A48] dark:text-[#BFD9D2] mb-1">
              {t(`dashboard.labels.${key}`)}
            </p>
            <p className="text-xs text-[#00AA85] font-medium">
              {formattedAmount(data.value)} {CURRENCY_SIGN}
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
