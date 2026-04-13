import {
  DollarSign,
  MonitorCheck,
  Percent,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

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

export const INCOME_CATEGORY_OPTIONS: IncomeCategoryOption[] = [
  {val: 'salary', icon: DollarSign, id: 1},
  {val: 'freelance', icon: MonitorCheck, id: 2},
  {val: 'investments', icon: Percent, id: 3},
  {val: 'cashback', icon: TrendingUp, id: 4},
];

export const getIncomeCategoryById = (id?: number | null) =>
  INCOME_CATEGORY_OPTIONS.find(category => category.id === id);
