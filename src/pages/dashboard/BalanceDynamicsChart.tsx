import StatisticsByDate from '@/components/StatisticsByDate';
import ChartsTitle from './ChartsTitle';
import ChartWrapper from './ChartWrapper';
import {useState} from 'react';
import type {Period} from '@/types/types';
import BalanceChart from './BalanceChart';

const BalanceDynamicsChart = () => {
  const [activePeriod, setActivePeriod] = useState<Period>('week');

  return (
    <ChartWrapper>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <ChartsTitle type="dynamicsBalance" />
        <StatisticsByDate
          value={activePeriod}
          onChange={value => setActivePeriod(value as Period)}
        />
      </div>
      {/* Chart Area */}
      <BalanceChart activePeriod={activePeriod} />
    </ChartWrapper>
  );
};

export default BalanceDynamicsChart;
