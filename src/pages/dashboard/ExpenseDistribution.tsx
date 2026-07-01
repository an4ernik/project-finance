import {PieChart, Pie, Cell, ResponsiveContainer, Label} from 'recharts';
import StatisticsByDate from '@/components/StatisticsByDate';
import {formattedAmount, getColors, getPeriodRange} from '@/helpers/helpers';
import ChartsTitle from './ChartsTitle';
import {useEffect, useMemo, useState} from 'react';
import {isWithinInterval} from 'date-fns';
import ChartWrapper from './ChartWrapper';
import type {Period} from '@/types/types'; 
import ExpenseDistributionList from './ExpenseDistributionList';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import type {TransactionResponseDTO} from '@/shared/api/models';
import {t} from 'i18next'; 
import { useGetCurrencySign } from '@/shared/store/useCurrencySign';
import { cn } from '@/lib/utils';

const EMPTY_DISTRIBUTION_ITEM = {
  name: '',
  value: 0.01,
  color: '#F97316',
  percentage: 0,
};

const ExpenseDonutChart = () => {
  const {data} = useGetTransactions({request: {limit: 100}});
  const CURRENCY_SIGN = useGetCurrencySign();


  const [activePeriod, setActivePeriod] = useState<Period>('week');
  const [radii, setRadii] = useState({innerRadius: 100, outerRadius: 140});

  const transactions = useMemo(() => {
    return (
      Array.isArray(data) ? data : (data?.data ?? [])
    ) as TransactionResponseDTO[];
  }, [data]);

  const expenseDistributionData = useMemo(() => {
    const range = getPeriodRange({
      period: activePeriod,
      category: [],
      search: '',
    });

    if (!range)
      return {
        allItems: [EMPTY_DISTRIBUTION_ITEM],
        chartData: [EMPTY_DISTRIBUTION_ITEM],
      };

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const filtered = transactions.filter(item => {
      if (item.type !== 'EXPENSE') return false;
      if (!item.date) return false;

      return isWithinInterval(new Date(item.date), {
        start: range.from,
        end: today,
      });
    });

    if (filtered.length === 0) {
      return {
        allItems: [EMPTY_DISTRIBUTION_ITEM],
        chartData: [EMPTY_DISTRIBUTION_ITEM],
      };
    }

    const groups = filtered.reduce<Record<string, number>>((acc, item) => {
      const categoryName = item.category?.name ?? 'Other';
      const amount = Number(item.amount ?? 0);

      acc[categoryName] = (acc[categoryName] || 0) + amount;

      return acc;
    }, {});

    const total = Object.values(groups).reduce((sum, value) => sum + value, 0);
    const dynamicPalette = getColors(Object.keys(groups).length);

    const allItems = Object.entries(groups)
      .map(([name, value], index) => ({
        name,
        value,
        color: dynamicPalette[index] || '#7F9E97',
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const chartData = allItems.filter(item => item.percentage > 0);

    return {
      allItems,
      chartData,
    };
  }, [activePeriod, transactions]);

  const currentHighest = expenseDistributionData.allItems[0] || null;
  console.log(currentHighest, 'cur');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setRadii({innerRadius: 90, outerRadius: 120});
      } else {
        setRadii({innerRadius: 100, outerRadius: 140});
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ChartWrapper>
      <div className="flex justify-between items-center mb-6">
        <ChartsTitle type="distribution" />

        <StatisticsByDate
          value={activePeriod}
          onChange={value => setActivePeriod(value as Period)}
        />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8">
        <div className="w-[300px] h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseDistributionData.chartData}
                cx="50%"
                cy="50%"
                innerRadius={radii.innerRadius}
                outerRadius={radii.outerRadius}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {expenseDistributionData.chartData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                ))}

                <Label
                  content={({viewBox}) => {
                    const {cx, cy} = viewBox as {cx: number; cy: number};

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={cx}
                          dy="-15"
                          className="fill-[#6F7E7C] dark:fill-[#7F9E97] text-[14px]"
                        >
                          {currentHighest?.name.slice(0, 15) + (currentHighest?.name.length > 15 ? '...' : '')}
                        </tspan>

                        <tspan
                          x={cx}
                          dy="30"
                          className={cn("fill-[#0B1514] dark:fill-white text-xl font-bold", currentHighest.value.toString().length > 10 && 'text-[16px]')}
                        >
                          {currentHighest && currentHighest.value > 1
                            ? formattedAmount(currentHighest.value)
                            : '0'}
                          {CURRENCY_SIGN}
                        </tspan>

                        <tspan
                          x={cx}
                          dy="25"
                          className="fill-[#7F9E97] text-[14px]"
                        >
                          {currentHighest && currentHighest.value !== 0.01
                            ? `${currentHighest.percentage}%`
                            : ''}
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {expenseDistributionData.chartData[0].value > 0.01 && (
          <ExpenseDistributionList
            expenseDistributionData={expenseDistributionData.allItems}
          />
        )}
        {expenseDistributionData.chartData[0].value === 0.01 && (
          <div className="w-full text-center text-[14px] text-[#7F9E97]">
            {t('dashboard.noExpenses')}
          </div>
        )}
      </div>
    </ChartWrapper>
  );
};

export default ExpenseDonutChart;
