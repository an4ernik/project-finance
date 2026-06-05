import {useState} from 'react';
import {useCreateTransaction} from '@/shared/api/generated/transaction-controller/transaction-controller';
import {runTransactionSeeding} from '../../seed/index';
import {Button} from '@/components/ui/button';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';

const SeedSettingsBlock = () => {
  const {mutateAsync: createTransactionAsync, isPending} =
    useCreateTransaction();

  const [isSeeding, setIsSeeding] = useState(false);

  const [tCount, setTCount] = useState<number>(100);

  const {data} = useGetCategories();

  const rawCategories = Array.isArray(data)
    ? data
    : data && 'data' in data && Array.isArray(data.data)
      ? data.data
      : [];

  const categoryIds = rawCategories
    .filter(
      item =>
        item &&
        typeof item.id === 'number' &&
        (item.type === 'INCOME' || item.type === 'EXPENSE'),
    )
    .map(item => ({
      id: item.id as number,
      type: item.type as 'INCOME' | 'EXPENSE',
    }));

  const handleStartSeed = async () => {
    if (categoryIds.length === 0) {
      console.warn('⚠️ Немає доступних категорій для засівання.');
      return;
    }
 

    setIsSeeding(true);

    await runTransactionSeeding(createTransactionAsync, {
      totalTransactions: tCount || 100,
      categoryIds: categoryIds,
    });

    setIsSeeding(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-slate-900">
      <h3 className="text-lg font-medium mb-2">Dev Tools</h3>
      <div className="flex items-center mb-4">
        <span>Count: </span>
        <input
          type="number"
          value={tCount}
          min={1}
          max={300}
          step={10}
          onChange={e => {
            const val = Number(e.target.value); 
            setTCount(val || 1);
          }}
          className="w-16 mr-2 px-2 py-1 border rounded-md"
        />
        <span>of transactions</span>
      </div>

      <Button
        onClick={handleStartSeed}
        disabled={isPending || isSeeding || categoryIds.length === 0}
        variant="primary"
      >
        {isSeeding
          ? `Generating ${tCount} items...`
          : `Create ${tCount} Transactions`}
      </Button>
    </div>
  );
};

export default SeedSettingsBlock;
