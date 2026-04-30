import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {FinanceOverview} from './dashboard/FinanceOverview';
import {FinanceCard} from './dashboard/FinanceCard';

import {TrendingUp, TrendingDown, Wallet} from 'lucide-react';
import CashFlowChart from './dashboard/CashFlowChart';
import ExpenseDonutChart from './dashboard/ExpenseDistribution';
import BalanceDynamicsChart from './dashboard/BalanceDynamicsChart';

const data = [
  {
    title: 'Доходи',
    type: 'income',
    value: '0',
    subtitle: 'Цей місяць',
    icon: TrendingUp,
    variant: 'green',
  },
  {
    title: 'Витрати',
    type: 'expense',
    value: '5400',
    subtitle: 'Цей місяць',
    icon: TrendingDown,
    variant: 'yellow',
  },
  {
    title: 'Баланс',
    type: 'balance',
    value: '4800',
    subtitle: 'Цей місяць',
    icon: Wallet,
    variant: 'teal',
  },
] as const;

function Dashboard() {
  const {t} = useTranslation();
  return (
    <AppLayout title={t('dashboard.title')}>
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* Finance Overview Section */}
        <FinanceOverview>
          {data.map((item, index) => (
            <FinanceCard key={index} {...item} Icon={item.icon}/>
          ))}
        </FinanceOverview>

        {/* Chart Section - Ensure it can grow/shrink */}
        <div className="w-full min-h-[300px]">
          <CashFlowChart />
        </div>

        {/* ExpenseDistribution */}
        <ExpenseDonutChart />
        <BalanceDynamicsChart/>
      </div>
 
    </AppLayout>
  );
} 
export default Dashboard;
