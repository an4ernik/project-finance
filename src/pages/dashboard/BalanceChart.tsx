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
import {DAY_KEYS, MONTH_KEYS} from '@/constances/constances';
import React, {useMemo} from 'react';
import type {Period} from '@/types/types';
import {cn} from '@/lib/utils';
import {formattedAmount, getPeriodRange} from '@/helpers/helpers';
import type {TransactionResponseDTO} from '@/shared/api/models';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import {endOfDay} from 'date-fns';
import {useGetCurrencySign} from '@/shared/store/useCurrencySign';

// const calculateYAxisWidth = (min: number, max: number) => {
//   const extremeValue = Math.abs(min) > Math.abs(max) ? min : max;

//   const formatted = (() => {
//     const abs = Math.abs(extremeValue);

//     if (abs >= 1_000_000_000) {
//       return `${(abs / 1_000_000_000).toFixed(1)} B`;
//     }

//     if (abs >= 1_000_000) {
//       return `${(abs / 1_000_000).toFixed(1)} M`;
//     }

//     if (abs >= 1_000) {
//       return `${(abs / 1_000).toFixed(1)} K`;
//     }

//     return abs.toString();
//   })();

//   return Math.max(50, formatted.length);
// };

const formatAxisValue = (value: number) => {
  const isNegative = value < 0;
  const abs = Math.abs(value);

  let formatted: string;

  if (abs >= 1_000_000_000) {
    formatted = `${(abs / 1_000_000_000).toFixed(1)}${' '}B`;
  } else if (abs >= 1_000_000) {
    formatted = `${(abs / 1_000_000).toFixed(1)}${' '}M`;
  } else if (abs >= 1_000) {
    formatted = `${(abs / 1_000).toFixed(1)}${' '}K`;
  } else {
    formatted = abs.toString();
  }

  return isNegative ? `-${formatted}` : formatted;
};

const calculateYAxisWidth = (min: number, max: number) => {
  const extremeValue = Math.abs(min) > Math.abs(max) ? min : max;

  const label = formatAxisValue(extremeValue);

  return Math.max(50, label.length * 6 + 10);
};

const BalanceChart = ({activePeriod}: {activePeriod: Period}) => {
  const {t} = useTranslation();
  const {data} = useGetTransactions({request: {limit: 1000}});
  const CURRENCY_SIGN = useGetCurrencySign();

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

    const padding = 1; 
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

  const chartLeftMargin = useMemo(() => {
    return dynamicYAxisWidth; // extra padding
  }, [dynamicYAxisWidth]);


  const hasData =
    chartData.length > 0 && chartData.some(item => item?.amount ?? 0 > 0);

  return (
    <>
      <div className="w-full h-full min-h-[280px] max-h-[500px] relative">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{right: 35, left: chartLeftMargin, bottom: 10, top: 10}}
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
                ticks={chartTicks}
                interval={0}
                domain={chartDomain}
                tickFormatter={formatAxisValue}
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

      {/* Bottom Section */}
      <div className="mt-4 pt-2 border-t border-[#1c3f35] flex flex-col sm:flex-row justify-around items-center text-[14px] flex-wrap gap-3">
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
export default React.memo(BalanceChart);
