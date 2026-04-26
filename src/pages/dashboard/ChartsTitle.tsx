import {cn} from '@/lib/utils';
import {useTranslation} from 'react-i18next';

type ChartType = 'overview' | 'cashflow' | 'distribution' | 'dynamicsBalance';

interface ChartsTitleProps {
  type: ChartType;
  titleClasses?: string;
  wrapperClasses?: string;
}

const ChartsTitle = ({
  type,
  titleClasses,
  wrapperClasses,
}: ChartsTitleProps) => {
  const {t} = useTranslation();

  // Mapping object for translation keys
  const titles: Record<ChartType, string> = {
    overview: 'dashboard.statistics.title',
    cashflow: 'dashboard.cashFlowChart.title',
    distribution: 'dashboard.expenseDistribution.title',
    dynamicsBalance: 'dashboard.dynamicsBalance.title',
  };

  return (
    <div className={cn('w-full text-left', wrapperClasses)}>
      <h2
        className={cn(
          'text-[#3A4A48] dark:text-[#BFD9D2] text-base sm:text-xl font-medium',
          titleClasses,
        )}
      >
        {t(titles[type])}
      </h2>
    </div>
  );
};

export default ChartsTitle;
