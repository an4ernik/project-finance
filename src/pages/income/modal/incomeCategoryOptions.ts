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
import type {TransactionType} from '@/types/types';
import type {CategoryOption} from '@/helpers/helpers';

export type IncomeCategoryValue =
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'cashback';

export interface IncomeCategoryOption {
  val: IncomeCategoryValue;
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


// export const INCOME_CATEGORY_OPTIONS: IncomeCategoryOption[] = [
//   {val: 'salary', icon: DollarSign, id: 1},
//   {val: 'freelance', icon: MonitorCheck, id: 2},
//   {val: 'investments', icon: Percent, id: 3},          
//   {val: 'cashback', icon: TrendingUp, id: 4},
// ];
