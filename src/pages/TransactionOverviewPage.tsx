import AppLayout from '@/layouts/AppLayout';
import TransactionOverview from '@/components/TransactionOverview'; 
import NotFound from '@/pages/NotFound';
import {useGetTransactionById} from '@/shared/api/generated/transaction-management/transaction-management';
import type {TransactionResponseDTO} from '@/shared/api/models';
import {useParams} from 'react-router-dom';
import MainDashboardSkeleton from '@/components/skeletons/MainDashboardSkeleton';

const TransactionOverviewPage = () => {
  const {id, transactionType} = useParams();
  const transactionId = Number(id);
  const isValidTransactionType =
    transactionType === 'income' || transactionType === 'expenses';
  const isValidTransactionId =
    Number.isFinite(transactionId) && transactionId > 0;

  const {data, isError, isLoading} = useGetTransactionById(transactionId, {
    query: {
      enabled: isValidTransactionType && isValidTransactionId,
    },
  });
  const transaction = data as TransactionResponseDTO | undefined;

  if (!isValidTransactionType || !isValidTransactionId) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <MainDashboardSkeleton />
      </AppLayout>
    );
  }

  if (isError || !transaction?.id) {
    return <NotFound />;
  }

  return (
    <AppLayout>
      <TransactionOverview item={transaction} />
    </AppLayout>
  );
};

export default TransactionOverviewPage;
