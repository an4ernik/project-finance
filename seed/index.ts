import { format } from 'date-fns';

// Типізація для мутації (відповідно до твого useCreateTransaction)
type CreateTransactionMutateFn = (variables: {
  data: {
    dto: {
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      categoryId: number;
      date: string;
      description: string;
      intervalUnit: 'ONCE';
    };
    receipts?: File[];
  };
}) => Promise<any>;

type TypTransaction = {
  id: number,
  type: 'INCOME' | 'EXPENSE',
}

interface SeedConfig {
  totalTransactions?: number;
  categoryIds?: TypTransaction[];
}

export const runTransactionSeeding = async (
  createTransactionAsync: CreateTransactionMutateFn,
  config?: SeedConfig
): Promise<void> => {
  const TOTAL_TRANSACTIONS = config?.totalTransactions ?? 100;
  const CATEGORY_IDS = config?.categoryIds ?? []; 
  
  const intervals = ['ONCE'] as const;

  const descriptions = [
    'Grocery shopping',
    'Salary bonus',
    'Freelance task',
    'Gym membership',
    'Coffee break',
    'Netflix',
    'Gas station',
    'Electricity bill',
    'Dinner',
  ];

  // Помічник для генерації випадкової дати за останні 90 днів у форматі yyyy-MM-dd
  const getRandomDateString = (): string => {
    const today = new Date();

    // Генеруємо випадкову кількість днів від 0 (сьогодні) до 90 днів у минуле
    const daysAgo = Math.floor(Math.random() * 91); // 0-90 включно

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - daysAgo);

    // format з 'date-fns' поверне чистий рядок "yyyy-MM-dd" (наприклад, "2026-06-04")
    return format(pastDate, 'yyyy-MM-dd');
  };

  console.log(`🚀 Запуск сид-скрипта через useCreateTransaction (${TOTAL_TRANSACTIONS} транзакцій)...`);

  for (let i = 1; i <= TOTAL_TRANSACTIONS; i++) {
    const amount = parseFloat((Math.random() * (1200 - 10) + 10).toFixed(2));
    if (!CATEGORY_IDS || CATEGORY_IDS.length === 0) {
      console.error('❌ Помилка: Масив CATEGORY_IDS пустий. Сидинг неможливий.');
      break;
    }

    // 🎯 2. Тепер TypeScript на 100% впевнений, що тут буде об'єкт TypTransaction
    const targetCategory = CATEGORY_IDS[Math.floor(Math.random() * CATEGORY_IDS.length)];

    // 🌟 БЕРЕМО ТИП, ЯКИЙ ПРИВ'ЯЗАНИЙ ДО ЦІЄЇ КАТЕГОРІЇ
    const type = targetCategory.type;
    const categoryId = targetCategory.id;
    const date = getRandomDateString();
    const intervalUnit = intervals[Math.floor(Math.random() * intervals.length)];
    const description = `${descriptions[Math.floor(Math.random() * descriptions.length)]} #${i}`;

    try {
      // Викликаємо оригінальну мутацію твоего згенерованого API
      await createTransactionAsync({
        data: {
          dto: {
            amount,
            type,
            categoryId,
            date,
            description,
            intervalUnit,
          },
          receipts: undefined, // Для сидів файли чеки не потрібні
        },
      });

      if (i % 50 === 0) {
        console.log(`⏳ Успішно створено ${i}/${TOTAL_TRANSACTIONS} транзакцій...`);
      }
    } catch (error: any) {
      console.error(`❌ Помилка на транзакції ${i}:`, error?.response?.data || error?.message);
      // Перериваємо цикл, якщо щось пішло не так (наприклад, токен застарів), щоб не спамити помилками
      break;
    }

    // Маленька пауза в 10мс між запитами, щоб інтерфейс не зависав під час сидингу
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  console.log('🎉 Засівання бази даних успішно завершено!');
};