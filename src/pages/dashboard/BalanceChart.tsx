import {useTranslation} from 'react-i18next';
import {
  CartesianGrid,
  LineChart,
  Tooltip,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import ChartTooltip from './ChartTooltip';
import {CURRENCY_SIGN, DAY_KEYS, MONTH_KEYS} from '@/constances/constances';
import React, {useMemo} from 'react';
import type {Period} from '@/types/types';
import {cn} from '@/lib/utils';
import {formattedAmount, getPeriodRange} from '@/helpers/helpers';
import type {TransactionResponseDTO} from '@/shared/api/models';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import {endOfDay} from 'date-fns';

// const calculateYAxisWidth = (maxValue: number) => {
//   // 1. Format the max value exactly how it will appear in the YAxis
//   // Example: 1234567 -> "1234.6K"
//   const formatted =
//     maxValue >= 1000 ? `${(maxValue / 1000).toFixed(1)}K` : maxValue.toString();

//   // 2. Estimate width: Base padding (20px) + ~9px per character (at 14px font size)
//   const estimatedWidth = 10 + formatted.length ;

//   // 3. Set a reasonable floor and ceiling
//   return Math.min(Math.max(estimatedWidth, 40), 80);
// };

const calculateYAxisWidth = (min: number, max: number) => {
  // Use the value with the most characters (either the lowest negative or highest positive)
  const extremeValue = Math.abs(min) > Math.abs(max) ? min : max;

  const formatted =
    Math.abs(extremeValue) >= 1000
      ? `${(extremeValue / 1000).toFixed(1)}K`
      : extremeValue.toString();

  // Increase multiplier: ~9px per character + base padding
  const estimatedWidth = 15 + formatted.length * 3;

  return Math.min(Math.max(estimatedWidth, 50), 100);
};

const BalanceChart = ({activePeriod}: {activePeriod: Period}) => {
  const {t} = useTranslation();
  const {data} = useGetTransactions();

  const transactions = useMemo(() => {
    return (
      Array.isArray(data) ? data : (data?.data ?? [])
    ) as TransactionResponseDTO[];
  }, [data]);

  const chartData = useMemo(() => {
    const range = getPeriodRange({
      period: activePeriod,
      category: [],
      search: '',
    });

    if (!range) return [];

    const today = endOfDay(new Date());

    const getBalanceUntil = (date: Date) => {
      const endDate = endOfDay(date);

      return transactions.reduce((acc, t) => {
        if (!t.date) return acc;

        const transactionDate = new Date(t.date);

        if (transactionDate > endDate) return acc;

        const amount = Number(t.amount ?? 0);

        return t.category?.type === 'INCOME' ? acc + amount : acc - amount;
      }, 0);
    };

    if (activePeriod === 'week') {
      return Array.from({length: 7}, (_, i) => {
        const d = new Date(range.from);
        d.setDate(d.getDate() + i);

        return {
          day: DAY_KEYS[d.getDay()],
          amount: d <= today ? getBalanceUntil(d) : null,
          fullDate: d.toLocaleDateString('ua-UA', {
            day: '2-digit',
            month: '2-digit',
          }),
        };
      });
    }

    if (activePeriod === 'month') {
      const daysInMonth = [];

      for (
        let d = new Date(range.from);
        d <= range.to;
        d.setDate(d.getDate() + 1)
      ) {
        const currentD = new Date(d);

        daysInMonth.push({
          day: DAY_KEYS[currentD.getDay()],
          amount: currentD <= today ? getBalanceUntil(currentD) : null,
          fullDate: currentD.toLocaleDateString('ua-UA', {
            day: '2-digit',
            month: '2-digit',
          }),
        });
      }

      return daysInMonth;
    }

    if (activePeriod === 'year') {
      return Array.from({length: 12}, (_, m) => {
        const monthStart = new Date(range.from.getFullYear(), m, 1);
        const monthEnd = new Date(range.from.getFullYear(), m + 1, 0);

        if (monthStart > today) {
          return {
            day: MONTH_KEYS[m],
            amount: null,
          };
        }

        const dateForBalance = monthEnd > today ? today : monthEnd;

        return {
          day: MONTH_KEYS[m],
          amount: getBalanceUntil(dateForBalance),
        };
      });
    }

    return [];
  }, [activePeriod, transactions]);

  const definedDaysData = chartData.filter(d => d.amount !== null);

  const currentBalance = definedDaysData.at(-1)?.amount ?? 0;

  const avgBalance =
    definedDaysData.length > 0
      ? Math.round(
          definedDaysData.reduce((sum, item) => sum + item.amount, 0) /
            definedDaysData.length,
        )
      : 0;

  const diff = currentBalance - avgBalance;
  const diffColor = diff >= 0 ? 'text-[#00AA85]' : 'text-[#FF6422]';
  const diffSign = diff >= 0 ? '+' : '';

  const chartDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1000];

    const validValues = chartData
      .map(d => d.amount)
      .filter(
        (value): value is number => value !== null && value !== undefined,
      );

    if (validValues.length === 0) return [0, 1000];

    const actualMax = Math.max(...validValues);
    const actualMin = Math.min(...validValues);

    // If the min is negative, use it; otherwise, default to 0
    const padding = 1; // Add 10% breathing room
    const bottom = actualMin < 0 ? Math.floor(actualMin * padding) : 0;
    const top = Math.max(1000, Math.ceil(actualMax * padding));

    return [bottom, top];
  }, [chartData]);

  const chartTicks = useMemo(() => {
    const [min, max] = chartDomain; // Assuming chartDomain is now [min, max]
    const numberOfTicks = 5;
    const range = max - min;
    const step = range / numberOfTicks;

    return Array.from({length: numberOfTicks + 1}, (_, i) =>
      Math.round(min + step * i),
    );
  }, [chartDomain]);

  const dynamicYAxisWidth = useMemo(() => {
    return calculateYAxisWidth(chartDomain[0], chartDomain[1]);
  }, [chartDomain]);

  const hasData =
    chartData.length > 0 && chartData.some(item => item?.amount ?? 0 > 0);

  return (
    <>
      <div className="w-full h-[280px] relative">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{right: 35, left: 35, bottom: 10, top: 10}}
            >
              <defs>
                {/* The Glow Effect Filter */}
                <filter
                  id="lineGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <CartesianGrid
                vertical={true}
                horizontal={false}
                stroke="#1c3f35"
                strokeOpacity={0.5}
              />

              <XAxis
                dataKey="day"
                tickFormatter={tick => {
                  const month = MONTH_KEYS.some(month => month === tick)
                    ? t(`dashboard.dynamicsBalance.months.${tick}`)
                    : t(`dashboard.dynamicsBalance.days.${tick}`);
                  return month;
                }}
                axisLine={false}
                tickLine={false}
                tick={{fill: '#7F9E97', fontSize: 14}}
                dy={10}
              />
              <YAxis
                // 1. Keep your custom ticks
                ticks={chartTicks}
                // 2. FORCE every tick to render (this is the key!)
                interval={0}
                // 3. Ensure the scale can actually reach 10k
                domain={chartDomain}
                tickFormatter={value => {
                  if (value === 0) return '0';
                  // Handle negative formatting correctly
                  const isNegative = value < 0;
                  const absValue = Math.abs(value);
                  const formatted = (absValue / 1000).toFixed(1);
                  return `${isNegative ? '-' : ''}${formatted}K`;
                }}
                axisLine={false}
                tickLine={false}
                tick={{fill: '#7F9E97', fontSize: 14}}
                width={dynamicYAxisWidth}
              />

              <Tooltip
                content={<ChartTooltip type="balance" />}
                cursor={{stroke: '#1c3f35', strokeWidth: 1}}
              />

              <Line
                connectNulls={true}
                type="linear"
                dataKey="amount"
                stroke="#00AA85"
                strokeWidth={2}
                dot={
                  definedDaysData.length === 1
                    ? {
                        r: 6,
                        fill: '#00AA85',
                        strokeWidth: 0,
                        fillOpacity: 1,
                      }
                    : false
                }
                activeDot={{
                  r: 6,
                  fill: '#00AA85',
                  stroke: '#0B1514',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-[#7F9E97]">
            {t('dashboard.noBalance')}
          </div>
        )}
      </div>

      <div className="mt-4 pt-2 border-t border-[#1c3f35] flex flex-col sm:flex-row justify-between items-center text-[14px]">
        <div className="flex items-center gap-2">
          <span className="text-[#7F9E97]">
            {t('dashboard.dynamicsBalance.currentBalance')}
          </span>
          <span className="text-[#3A4A48] dark:text-[#7F9E97] font-medium">
            {formattedAmount(currentBalance)} {CURRENCY_SIGN}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#7F9E97]">
            {t('dashboard.dynamicsBalance.middleBalance')}
          </span>
          <span className="text-[#3A4A48] dark:text-[#7F9E97] font-medium">
            {formattedAmount(avgBalance)} {CURRENCY_SIGN}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#7F9E97]">
            {t('dashboard.dynamicsBalance.difference')}
          </span>
          <span className={cn('font-bold', diffColor)}>
            {diffSign} {formattedAmount(diff)} {CURRENCY_SIGN}
          </span>
        </div>
      </div>
    </>
  );
};
export default React.memo(BalanceChart)
