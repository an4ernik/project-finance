import {PieChart, Pie, Cell, ResponsiveContainer, Label} from 'recharts';
import StatisticsByDate from '@/components/StatisticsByDate';
import {formattedAmount, getColors, getPeriodRange} from '@/helpers/helpers';
import ChartsTitle from './ChartsTitle';
import {useMemo, useState} from 'react';
import {isWithinInterval} from 'date-fns';
import ChartWrapper from './ChartWrapper';
import type {Period} from '@/types/types';
import ExpenseDistributionList from './ExpenseDistributionList';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import type {TransactionResponseDTO} from '@/shared/api/models';
import {useGetCurrencySign} from '@/shared/store/useCurrencySign';
import {cn} from '@/lib/utils';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useTranslation} from 'react-i18next';

type ExpenseDistributionItem = {
  name: string;
  value: number;
  color: string;
  percentage: number;
};

const EMPTY_DISTRIBUTION_ITEM: ExpenseDistributionItem = {
  name: '',
  value: 0.01,
  color: '#F97316',
  percentage: 0,
};

const ExpenseDonutChart = () => {
  const {data} = useGetTransactions({request: {limit: 100}});
  const CURRENCY_SIGN = useGetCurrencySign();

  const {t} = useTranslation();

  const [activePeriod, setActivePeriod] = useState<Period>('week');

  const [hoveredItem, setHoveredItem] =
    useState<ExpenseDistributionItem | null>(null);
  const [selectedItem, setSelectedItem] =
    useState<ExpenseDistributionItem | null>(null);

  const activeItem = selectedItem ?? hoveredItem;

  const isMobile = useMediaQuery('(max-width: 639px)');
  const radii = isMobile
    ? {innerRadius: 90, outerRadius: 120}
    : {innerRadius: 100, outerRadius: 140};

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
        totalExpenses: 0,
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
        totalExpenses: 0,
      };
    }

    const groups = filtered.reduce<Record<string, number>>((acc, item) => {
      const categoryName = item.category?.name ?? 'Other';
      const amount = Number(item.amount ?? 0);

      acc[categoryName] = (acc[categoryName] || 0) + amount;

      return acc;
    }, {});

    const totalExpenses = Object.values(groups).reduce(
      (sum, value) => sum + value,
      0,
    );
    const dynamicPalette = getColors(Object.keys(groups).length);

    const allItems = Object.entries(groups)
      .map(([name, value], index) => ({
        name,
        value,
        color: dynamicPalette[index] || '#7F9E97',
        percentage:
          totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const chartData = allItems.filter(item => item.percentage > 0);

    return {
      allItems,
      chartData,
      totalExpenses,
    };
  }, [activePeriod, transactions]);

  const isDataEmpty = expenseDistributionData.chartData[0].value === 0.01;

  const displayData = useMemo(() => {
    if (isDataEmpty) {
      return {name: '', value: 0, percentage: null};
    }

    if (activeItem) {
      return {
        name: activeItem.name,
        value: activeItem.value,
        percentage: `${activeItem.percentage}%`,
      };
    }
    return {
      name: t('dashboard.total', 'Total'),
      value: expenseDistributionData.totalExpenses,
      percentage: null,
    };
  }, [activeItem, expenseDistributionData, isDataEmpty, t]);

  return (
    <ChartWrapper>
      <div className="flex justify-between items-center mb-6">
        <ChartsTitle type="distribution" />

        <StatisticsByDate
          value={activePeriod}
          onChange={value => setActivePeriod(value as Period)}
        />
      </div>

      <div
        className="flex flex-wrap justify-center items-center gap-8"
        onPointerDown={e => {
          const target = e.target as HTMLElement;

          if (!target.closest('.recharts-sector')) {
            setSelectedItem(null);
          }
        }}
      >
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
                onMouseLeave={() => setHoveredItem(null)}
              >
                {expenseDistributionData.chartData.map((entry, index) => {
                  return (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={entry.color}
                      className="cursor-pointer outline-none transition-all duration-200"
                      style={{
                        cursor: isDataEmpty ? 'default' : 'pointer',
                        opacity:
                          activeItem && activeItem.name !== entry.name
                            ? 0.6
                            : 1,
                      }}
                      onMouseEnter={() =>
                        !isDataEmpty && !isMobile
                          ? setHoveredItem(entry)
                          : undefined
                      }
                      onMouseLeave={() =>
                        !isDataEmpty && !isMobile
                          ? setHoveredItem(null)
                          : undefined
                      }
                      onPointerDown={() => {
                        if (!isMobile) return;
                        setSelectedItem(prev =>
                          prev?.name === entry.name ? null : entry,
                        );
                      }}
                    />
                  );
                })}

                <Label
                  content={({viewBox}) => {
                    const {cx, cy} = viewBox as {cx: number; cy: number};

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        onClick={e => e.stopPropagation()}
                      >
                        {/* name */}
                        <tspan
                          x={cx}
                          dy="-15"
                          className="fill-[#6F7E7C] dark:fill-[#7F9E97] text-[14px]"
                        >
                          {displayData.name.slice(0, 15) +
                            (displayData.name.length > 15 ? '...' : '')}
                        </tspan>

                        {/* amount */}
                        <tspan
                          x={cx}
                          dy="30"
                          className={cn(
                            'fill-[#0B1514] dark:fill-white text-xl font-bold',
                            displayData.value.toString().length > 10 &&
                              'text-[14px]',
                          )}
                        >
                          {displayData.value > 0
                            ? formattedAmount(displayData.value)
                            : '0'}
                          {CURRENCY_SIGN}
                        </tspan>

                        {/* Percentage (shown only when hovering over a specific category) */}
                        {displayData.percentage && (
                          <tspan
                            x={cx}
                            dy="25"
                            className="fill-[#7F9E97] text-[14px] font-medium"
                          >
                            {displayData.percentage}
                          </tspan>
                        )}
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {!isDataEmpty && (
          <ExpenseDistributionList
            expenseDistributionData={expenseDistributionData.allItems}
          />
        )}
        {isDataEmpty && (
          <div className="w-full text-center text-[14px] text-[#7F9E97]">
            {t('dashboard.noExpenses')}
          </div>
        )}
      </div>
    </ChartWrapper>
  );
};

export default ExpenseDonutChart;
