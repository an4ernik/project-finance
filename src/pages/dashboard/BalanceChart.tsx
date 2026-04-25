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
import { useMemo } from 'react';
import type { Period } from '@/types/types';
import { cn } from '@/lib/utils';
import { getPeriodRange } from '@/helpers/helpers';
import { isWithinInterval } from 'date-fns';

const BalanceChart = ({activePeriod}: {activePeriod: Period}) => {
const {t} = useTranslation();

  const fullYearBalanceData = useMemo(() => {
    const data = [];
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 11, 31);
    let currentBalance = 5000;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const change = Math.floor(Math.random() * 2000) - 800;
      currentBalance = Math.max(1000, Math.min(15000, currentBalance + change));

      data.push({
        name: 'balance',
        day: d.toLocaleDateString('uk-UA', {weekday: 'short'}),
        date: d.toLocaleDateString('uk-UA', {day: '2-digit', month: '2-digit'}),
        month: d.toLocaleDateString('uk-UA', {month: 'short'}),
        value: currentBalance,
        fullDate: new Date(d),
      });
    }
    return data;
  }, []);

  const chartData = useMemo(() => {
    const range = getPeriodRange({
      period: activePeriod,
      category: [],
      search: '',
    });
    if (!range) return [];

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // --- WEEK (7 days) ---
    if (activePeriod === 'week') {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(range.from);
        d.setDate(d.getDate() + i);

        const found = fullYearBalanceData.find(
          item =>
            item.fullDate.getDate() === d.getDate() &&
            item.fullDate.getMonth() === d.getMonth() &&
            item.fullDate.getFullYear() === d.getFullYear(),
        );

        days.push({
          day: DAY_KEYS[d?.getDay()],
          value: d <= today ? (found ? found.value : null) : null,
          fullDate: d.toLocaleDateString('ua-UA', {
            day: '2-digit',
            month: '2-digit',
          }),
        });
      }
      return days;
    }

    // --- MONTH (all days in that month) ---
    if (activePeriod === 'month') {
      const daysInMonth = [];
      const start = new Date(range.from);
      const end = new Date(range.to);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);

        const found = fullYearBalanceData.find(
          item =>
            item.fullDate.getDate() === currentDate.getDate() &&
            item.fullDate.getMonth() === currentDate.getMonth() &&
            item.fullDate.getFullYear() === currentDate.getFullYear(),
        );

        daysInMonth.push({
          day: DAY_KEYS[currentDate.getDay()],
          dayNumber: currentDate.getDate(),
          value: currentDate <= today ? (found ? found.value : null) : null,
          fullDate: d.toLocaleDateString('ua-UA', {
            day: '2-digit',
            month: '2-digit',
          }),
        });
      }
      return daysInMonth;
    }

    // --- YEAR (12 months, aggregated values) ---
    if (activePeriod === 'year') {
      const months = [];
      const year = range.from.getFullYear();

      for (let month = 0; month < 12; month++) {
        const monthData = fullYearBalanceData.filter(
          item =>
            item.fullDate.getFullYear() === year &&
            item.fullDate.getMonth() === month &&
            item.fullDate <= today,
        );

        const totalValue = monthData.reduce((sum, item) => sum + item.value, 0);
        const avgValue =
          monthData.length > 0
            ? Math.round(totalValue / monthData.length)
            : null;

        months.push({
          day: MONTH_KEYS[month],
          value: monthData.length > 0 ? avgValue : null,
        });
      }
      return months;
    }

    // Default fallback
    return fullYearBalanceData.filter(
      item =>
        isWithinInterval(item.fullDate, {start: range.from, end: range.to}) &&
        item.fullDate <= today,
    );
  }, [activePeriod, fullYearBalanceData]);

  // Summary Stats based on filtered data
  const definedDaysData = chartData.filter(d => d.value !== null);
  const currentBalance =
    definedDaysData[definedDaysData.length - 1]?.value || 0;

  const avgBalance =
    definedDaysData.length > 0
      ? Math.round(
          definedDaysData.reduce((a, b) => a + (b?.value || 0), 0) /
            definedDaysData.length,
        )
      : 0;

  const diff = currentBalance - avgBalance;
  const diffColor = diff >= 0 ? 'text-[#00AA85]' : 'text-[#FF6422]';
  const diffSign = diff >= 0 ? '+' : '';

  const chartDomain = useMemo(() => {
    if (chartData.length === 0) return 10000;

    // Filter out null values and then map to get only numbers
    const validValues = chartData
      .map(d => d.value)
      .filter(
        (value): value is number => value !== null && value !== undefined,
      );

    if (validValues.length === 0) return 10000;

    const actualMax = Math.max(...validValues);
    return Math.max(5000, Math.floor(actualMax));
  }, [chartData]);

  // Generate dynamic ticks based on the domain
  const chartTicks = useMemo(() => {
    const numberOfTicks = 5;
    const step = chartDomain / numberOfTicks;
    return Array.from({length: numberOfTicks + 1}, (_, i) =>
      Math.round(step * i),
    );
  }, [chartDomain]);

  return (
    <>
      <div className="w-full h-[280px] relative">
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
              domain={[0, chartDomain]}
              // 4. Formatter for the 'k' look
              tickFormatter={value => (value === 0 ? '0' : `${value / 1000}K`)}
              axisLine={false}
              tickLine={false}
              tick={{fill: '#7F9E97', fontSize: 14}}
              width={45}
            />

            <Tooltip
              content={<ChartTooltip type="balance" />}
              cursor={{stroke: '#1c3f35', strokeWidth: 1}}
            />

            <Line
              connectNulls={false}
              type="linear"
              dataKey="value"
              stroke="#00AA85"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#00AA85',
                stroke: '#0B1514',
                strokeWidth: 2,
              }}
              style={{filter: 'url(#lineGlow)'}} // Applies neon effect
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-2 border-t border-[#1c3f35] flex flex-col sm:flex-row justify-between items-center text-[14px]">
        <div className="flex items-center gap-2">
          <span className="text-[#7F9E97]">
            {t('dashboard.dynamicsBalance.currentBalance')}
          </span>
          <span className="text-[#3A4A48] dark:text-[#7F9E97] font-medium">
            {currentBalance} {CURRENCY_SIGN}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#7F9E97]">
            {t('dashboard.dynamicsBalance.middleBalance')}
          </span>
          <span className="text-[#3A4A48] dark:text-[#7F9E97] font-medium">
            {avgBalance} {CURRENCY_SIGN}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#7F9E97]">
            {t('dashboard.dynamicsBalance.difference')}
          </span>
          <span className={cn('font-bold', diffColor)}>
            {diffSign} {diff} {CURRENCY_SIGN}
          </span>
        </div>
      </div>
    </>
  );
};
export default BalanceChart;
