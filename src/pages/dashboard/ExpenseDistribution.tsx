import {PieChart, Pie, Cell, ResponsiveContainer, Label} from 'recharts';
import StatisticsByDate from '@/components/StatisticsByDate';
import {formattedAmount, getColors, getPeriodRange} from '@/helpers/helpers';
import ChartsTitle from './ChartsTitle';
import {useEffect, useMemo, useState} from 'react';
import {isWithinInterval} from 'date-fns';
import ChartWrapper from './ChartWrapper';
import type {Period} from '@/types/types';
import {CURRENCY_SIGN} from '@/constances/constances';
import ExpenseDistributionList from './ExpenseDistributionList';

const rawExpenseTransactions = [
  {name: 'products', amount: 1200, date: '2026-04-20', category: 'products'},
  {name: 'products', amount: 1000, date: '2026-04-15', category: 'products'},
  {name: 'products', amount: 1000, date: '2026-03-25', category: 'products'},
  {name: 'Netflix', amount: 600, date: '2026-04-01', category: 'subscriptions'},
  {name: 'Spotify', amount: 400, date: '2026-03-15', category: 'subscriptions'},
  {name: 'Dog Food', amount: 700, date: '2026-04-18', category: 'petFood'},
  {name: 'Starbucks', amount: 150, date: '2026-04-21', category: 'coffee'},
  {name: 'Local Cafe', amount: 150, date: '2026-04-10', category: 'coffee'},
  {name: 'Local Cafe', amount: 150, date: '2026-04-25', category: 'coffee'},
  {name: 'Gas', amount: 200, date: '2026-04-19', category: 'machine'},
];

const ExpenseDonutChart = () => {
  const [activePeriod, setActivePeriod] = useState<Period>('week');
  const [radii, setRadii] = useState({innerRadius: 100, outerRadius: 140});

  const expenseDistributionData = useMemo(() => {
    const range = getPeriodRange({
      period: activePeriod,
      category: [],
      search: '',
    });
    if (!range) return [];

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let filtered = rawExpenseTransactions.filter(item =>
      isWithinInterval(new Date(item.date), {start: range.from, end: today}),
    );

    if (filtered.length === 0) {
      filtered = [
        {
          name: 'Life',
          amount: 0.01,
          date: new Date().toISOString().split('T')[0],
          category: '',
        },
      ];
    }

    const groups = filtered.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = Object.values(groups).reduce((a, b) => a + b, 0);
    const dynamicPalette = getColors(filtered.length);

    return Object.entries(groups)
      .map(([name, value], index) => ({
        name,
        value,
        color: dynamicPalette[index] || '#7F9E97',
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [activePeriod]);

  const currentHighest = expenseDistributionData[0] || null;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // mobile
        setRadii({innerRadius: 90, outerRadius: 120});
      } else {
        // desktop
        setRadii({innerRadius: 100, outerRadius: 140});
      }
    };

    handleResize(); // Set initial values
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

      <div className="flex flex-wrap flex-col lg:flex-row justify-center items-center gap-2 sm:gap-8">
        <div className=" w-[300px] h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={radii.innerRadius}
                outerRadius={radii.outerRadius}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {expenseDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                          {currentHighest?.name}
                        </tspan>

                        <tspan
                          x={cx}
                          dy="30"
                          className="fill-[#0B1514] dark:fill-white text-xl font-bold"
                        >
                          {currentHighest?.value > 1
                            ? formattedAmount(currentHighest?.value || 0)
                            : '0'}
                          {CURRENCY_SIGN}
                        </tspan>

                        <tspan
                          x={cx}
                          dy="25"
                          className="fill-[#7F9E97] text-[14px]"
                        >
                          {currentHighest?.value !== 0.01
                            ? `${currentHighest.percentage}%`
                            : '0%'}
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {expenseDistributionData.length > 0 && (
          <ExpenseDistributionList
            expenseDistributionData={expenseDistributionData}
          />
        )}
      </div>
    </ChartWrapper>
  );
};

export default ExpenseDonutChart;
