
import {
  Coffee,
  Dog,
  DollarSign,
  Film,
  MonitorCheck,
  Percent,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
 
import type {DateRange, Filters, TransactionType} from '@/types/types';
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
} from 'date-fns'; 

export const REPEAT_TYPES = ['once', 'yearly', 'monthly'];

export const toTransactionDtoType = (type: TransactionType) =>
  type.toUpperCase() as Uppercase<TransactionType>;


// * format this: 15400 -> 15 400
// export const formattedAmount = (amount: string | number) => new Intl.NumberFormat('uk-UA').format(Math.floor(Number(amount)))
export const formattedAmount = (amount: string | number) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 0, // don't show decimal places
    maximumFractionDigits: 2, // show 2 decimal places if there are any
  }).format(num);
};
// * get period range by filters
export const getPeriodRange = (filters: Filters): DateRange => {
    const now = new Date();

    switch (filters.period) {
        case 'today':
            return {
                from: startOfDay(now),
                to: endOfDay(now),
            };

        case 'week':
            return {
                from: startOfWeek(now, { weekStartsOn: 1 }),
                to: endOfWeek(now, { weekStartsOn: 1 }),
            };

        case 'month':
            return {
                from: startOfMonth(now),
                to: endOfMonth(now),
            };

        case 'year':
            return {
                from: startOfYear(now),
                to: endOfYear(now),
            };

        case 'custom':
            if (!filters.fromDate || !filters.toDate) return null;

            return {
                from: startOfDay(filters.fromDate),
                to: endOfDay(filters.toDate),
            };

        default:
            return null;
    }
};


export type RepeatType = 'this_only' | 'all_future';
export interface IncomeFormData {
    id: number;
    amount: string | number;
    categoryId: number;
    date: Date;
    description?: string;
    isRepeat: string;
    repeatType?: RepeatType;
    files?: File[];
    Icon: LucideIcon;

}

export const CATEGORY_MAP = (type: 'income' | 'expense') => Object.fromEntries(
  TRANSACTION_CATEGORIES[type].map(c => [c.val, c.id]),
);

export const applyFilters = (
    items: IncomeFormData[],
    filters: Filters,
    search: string,
) => {
    let result = [...items];

    if (search) {
        const normalized = search.toLowerCase();

        result = result.filter(item =>
            (item.description ?? '')
                .toLowerCase()
                .includes(normalized)
        );
    }

    if (!filters.category.includes('allCategories')) {
        const selectedIds = filters.category.map(
            val => CATEGORY_MAP('income')[val] ?? CATEGORY_MAP('expense')[val]
        ).filter((id): id is number => id !== undefined);

        result = result.filter(item => selectedIds.includes(item.categoryId));
    }

    const range = getPeriodRange(filters);

    if (range?.from && range?.to) {
    const { from, to } = range;

    result = result.filter(
        item => item.date >= from && item.date <= to,
    );
}
    return result;
};

// * get category by id, categories for income and expense
export interface CategoryOption {
  val: string;
  icon: LucideIcon;
  id: number;
}
export const TRANSACTION_CATEGORIES: Record<TransactionType, CategoryOption[]> =
  {
    income: [ 
      {val: 'salary', icon: DollarSign, id: 1},
      {val: 'freelance', icon: MonitorCheck, id: 2},
      {val: 'investments', icon: Percent, id: 3},
      {val: 'cashback', icon: TrendingUp, id: 4},
    ],
    expense: [ 
      {val: 'coffee', icon: Coffee, id: 1},
      {val: 'products', icon: ShoppingCart, id: 2},
      {val: 'petFood', icon: Dog, id: 3},
      {val: 'subscriptions', icon: Film, id: 4},
    ],
  };

export const getIncomeCategoryById = (type: 'expense' | 'income', id?: number | null) =>
  TRANSACTION_CATEGORIES[type].find(category => category.id === id);
