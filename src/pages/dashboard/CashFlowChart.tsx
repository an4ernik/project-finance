import {cn} from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  LabelList,
} from 'recharts';

import {useTranslation} from 'react-i18next';
import StatisticsByDate from '@/components/StatisticsByDate';
import {useTheme} from '@/shared/providers/ThemeProvider';
import ChartTooltip from './ChartTooltip';

const chartTheme = {
  dark: {
    tick: '#7F9E97',
    label: '#5A736E',
    grid: '#5A736E',
    income: {
      start: '#02624D99',
      end: '#04C89E',
    },
    expense: {
      start: '#AA7D0033',
      end: '#AA7D00',
    },
  },
  light: {
    tick: '#6F7E7C',
    label: '#6F7E7C',
    grid: '#6F7E7C',
    income: {
      start: '#02A0784D',
      end: '#02A078',
    },
    expense: {
      start: '#E6E6E6',
      end: '#FF7C02CC',
    },
  },
};

import {isWithinInterval} from 'date-fns';
import {formattedAmount, getPeriodRange} from '@/helpers/helpers';
import {useMemo, useState} from 'react';
import type {Period} from '@/types/types';
import ChartsTitle from './ChartsTitle';
import ChartWrapper from './ChartWrapper';
import {CURRENCY_SIGN} from '@/constances/constances';
import {useMediaQuery} from '@/hooks/useMediaQuery';
export type Filters = {
  period: Period;
  fromDate?: Date;
  toDate?: Date;
  category: string[];
  search: string;
};

import type {Transaction} from '@/types/types';
interface Props {
  data: Transaction[];
}
const CashFlowChart = ({data = []}: Props) => {
  const [activePeriod, setActivePeriod] = useState<Period>('week');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const {t} = useTranslation();
  const {theme} = useTheme();

  const totals = useMemo(() => {
    const range = getPeriodRange({
      period: activePeriod,
      category: [],
      search: '',
    });

    if (!range) return {income: 0, expense: 0, max: 0};

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let income = 0;
    let expense = 0;
    let max = 0;

    data.forEach(item => {
      const date = new Date(item.date);

      if (
        isWithinInterval(date, {
          start: range.from,
          end: today,
        })
      ) {
        const amount = Number(item.amount);

        if (item.category.type === 'INCOME') income += amount;
        else expense += amount;
      }
      max = Math.max(income, expense);
    });

    return {
      chartData: [
        {name: 'INCOME', type: 'INCOME', amount: income},
        {name: 'EXPENSE', type: 'EXPENSE', amount: expense},
      ],
      netFlow: income - expense,
      max,
    };
  }, [activePeriod, data]);

  const generateTicks = (max: number, count: number = 5) => {
    if (max === 0) return [0];
    const step = max / (count - 1);
    return Array.from({length: count}, (_, i) => Math.round(step * i));
  };

  const activeTheme = chartTheme[theme] || chartTheme.dark;
  const chartDomain = totals.max;
  const netFlow = totals.netFlow;
  const chartData = totals.chartData;

  return (
    <ChartWrapper>
      <div className="flex justify-between items-center ">
        <ChartsTitle type="cashflow" />
        <StatisticsByDate
          value={activePeriod}
          onChange={value => setActivePeriod(value as Period)}
        />
      </div>

      {chartDomain ? (
        <div className="w-full pb-[5px] min-h-[180px] pb-[5px]">
          <ResponsiveContainer>
            <BarChart
              layout={'vertical'}
              data={chartData}
              margin={{
                top: isMobile ? 20 : 5,
                right: 0,
                left: isMobile ? 10 : 5,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={activeTheme.income.start} />
                  <stop offset="100%" stopColor={activeTheme.income.end} />
                </linearGradient>

                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor={activeTheme.expense.start} />
                  <stop offset="100%" stopColor={activeTheme.expense.end} />
                </linearGradient>

                <filter
                  id="blackShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur
                    in="SourceAlpha"
                    stdDeviation="3"
                    result="blur"
                  />

                  <feOffset in="blur" dx="0" dy="4" result="offsetBlur" />

                  <feComponentTransfer in="offsetBlur" result="shadowColor">
                    <feFuncR type="linear" slope="0" />
                    <feFuncG type="linear" slope="0" />
                    <feFuncB type="linear" slope="0" />
                    <feFuncA type="linear" slope="0.4" />{' '}
                  </feComponentTransfer>

                  <feMerge>
                    <feMergeNode in="shadowColor" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <Tooltip
                content={<ChartTooltip />}
                cursor={{fill: 'transparent'}}
              />

              <XAxis
                type="number"
                axisLine={{stroke: activeTheme.grid, strokeWidth: 1}}
                tickLine={false}
                tick={{fill: activeTheme.tick, fontSize: isMobile ? 12 : 14}}
                tickFormatter={value => {
                  if (value >= 1000) {
                    const kiloValue = value.toFixed(1);
                    return `${formattedAmount(kiloValue)}K`;
                  }

                  return formattedAmount(value);
                }}
                domain={[0, chartDomain]}
                ticks={generateTicks(chartDomain, 5)}
                tickCount={5}
                dy={isMobile ? 2 : 5}
              />

              <YAxis
                width={isMobile ? 0 : 80}
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{fill: activeTheme.tick, fontSize: 14}}
                tickFormatter={value => t(`dashboard.labels.${value}`)}
              />

              <Bar
                dataKey="amount"
                radius={[4, 4, 4, 4]}
                barSize={isMobile ? 30 : 45}
                style={{filter: 'url(#blackShadow)'}}
              >
                {isMobile && (
                  <LabelList
                    dataKey="name"
                    position="top"
                    offset={10}
                    content={props => {
                      const {x, y, value} = props;
                      return (
                        <text
                          x={x}
                          y={(y as number) - 7}
                          fill={activeTheme.tick}
                          fontSize={14}
                          fontWeight="500"
                          textAnchor="start"
                        >
                          {t(`dashboard.labels.${value}`)}
                        </text>
                      );
                    }}
                  />
                )}

                {chartData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.type === 'INCOME'
                        ? 'url(#incomeGradient)'
                        : 'url(#expenseGradient)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[180px] flex items-center justify-center text-[#7F9E97]">
          {t('dashboard.noExpensesCashFlow')}
        </div>
      )}

      {/* Footer Section */}
      <div
        className={cn(
          'sm:mt-5 border-t border-t-[#9AA7A5]! dark:border-t-[#5A736E]! flex justify-between items-center',
        )}
      >
        <span
          style={{color: activeTheme.label}}
          className="text-[14px] sm:text-base"
        >
          {t('dashboard.cashFlowChart.subtitle')}
        </span>
        <span
          className={cn(
            'text-[#00AA85] dark:text-[#00AA85] font-bold text-[14px] sm:text-[20px]',
          )}
        >
          {netFlow && formattedAmount(netFlow)} {CURRENCY_SIGN}
        </span>
      </div>
    </ChartWrapper>
  );
};

export default CashFlowChart;
