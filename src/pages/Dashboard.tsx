import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {FinanceOverview} from './dashboard/FinanceOverview';
import {FinanceCard} from './dashboard/FinanceCard';

import CashFlowChart from './dashboard/CashFlowChart';
import ExpenseDonutChart from './dashboard/ExpenseDistribution';
import BalanceDynamicsChart from './dashboard/BalanceDynamicsChart';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import {useMemo} from 'react';
import type {Transaction} from '@/types/types';
type CardItem = {
  type: 'INCOME' | 'EXPENSE' | 'BALANCE';
  total: number;
  date?: Date;
};

function Dashboard() {
  const {t} = useTranslation();
  const {data} = useGetTransactions();

  const transactions = useMemo(() => {
    return (Array.isArray(data) ? data : (data?.data ?? [])) as Transaction[];
  }, [data]);

  const totals = useMemo<CardItem[]>(() => {
    let income = 0;
    let expense = 0;
    let date = undefined;

    transactions.forEach(item => {
      const amount = parseFloat(String(item.amount));

      date = new Date(item.date);

      if (item.category.type === 'INCOME') {
        income += amount;
      } else if (item.category.type === 'EXPENSE') {
        expense += amount;
      }
    });

    return [
      {
        type: 'INCOME',
        total: income,
      },
      {
        type: 'EXPENSE',
        total: expense,
        date,
      },
      {
        type: 'BALANCE',
        total: income - expense,
      },
    ];
  }, [transactions]);

  return (
    <AppLayout title={t('dashboard.title')}>
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* Finance Overview Section */}
        <FinanceOverview>
          {totals &&
            totals.map(item => (
              <FinanceCard
                key={item.type}
                type={item.type}
                total={item.total}
              />
            ))}
        </FinanceOverview>

        <div className="w-full min-h-[300px]">
          <CashFlowChart data={transactions} />
        </div>

        {/* ExpenseDistribution */}
        <ExpenseDonutChart />
        <BalanceDynamicsChart />
      </div>
    </AppLayout>
  );
}
export default Dashboard;
