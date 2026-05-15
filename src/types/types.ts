import type { LucideIcon } from "lucide-react";
import type { CategoryResponseDTO, TransactionResponseDTO } from '@/shared/api/models';

export type ModalMode = 'create' | 'update';
export type ModalType = 'INCOME' | 'EXPENSE';
export type RepeatType = 'ONLY_THIS' | 'THIS_AND_FUTURE';
export type TransactionType = 'INCOME' | 'EXPENSE';
export const ALL_CATEGORIES_VALUE = 'allCategories';

//* transaction types
export type Transaction = {
  id?: number;
  description?: string;
  amount: number | string;
  category: {
    id: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
    status?: 'ACTIVE' | 'ARCHIVED';
  };
  intervalUnit?: string;
  date: Date | string;
  files?: File[];
  type?: 'INCOME' | 'EXPENSE';
  receiptsUrls?: string[];
};

export type TransactionUI = Transaction & {
  Icon?: LucideIcon;
  intervalUnit?: string;
  isTransactionsLength?: number;
};

export type Props = {
  type: 'INCOME' | 'EXPENSE';
  data?: TransactionUI[];
  isTransactionsLength?: boolean;
  isLoading?: boolean;
};

// ==========================================================================

//* VirtualItem types and props
export interface Category {
  id: number;
  name: string;
  icon: string;
  type?: 'INCOME' | 'EXPENSE';
  status?: 'ACTIVE' | 'ARCHIVED';
}

export interface Item {
  id?: number;
  accountId?: number;
  amount: number | string;
  description?: string;
  category: Category;
  intervalUnit?: string;
  type?: 'INCOME' | 'EXPENSE';
  date: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  receiptsUrls?: string[];
}
export interface VirtualItemProps {
  item: Item;
  type?: 'INCOME' | 'EXPENSE';
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}
// ==========================================================================

// * Modal types and props
export interface IncomeFormData {
  id?: number;
  amount: number | string;
  category: {
    id: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
  };
  date: string | Date;
  intervalUnit?: string;
  description?: string;
}

// ? mainModal
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  item: IncomeFormData | Item | null;
  type?: 'INCOME' | 'EXPENSE';
};

export interface MainModalData {
  id?: number;
  amount: number | string;
  categoryId?: number;
  category: { id: number; name: string; icon: string; type: 'INCOME' | 'EXPENSE' };
  date: string | Date;
  description?: string;
  intervalUnit?: string;
  repeatType?: RepeatType;
  files?: File[];
}

export interface IncomeModalProps {
  title?: string;
  type?: 'INCOME' | 'EXPENSE';
  mode?: ModalMode;
  onClose: () => void;
  initialData?: MainModalData | null;
}

export type CategoryInItem = Category;

export type ApiTransaction = TransactionResponseDTO;
export type ApiCategory = CategoryResponseDTO;
// ==========================================================================

// *for filters
export type Period = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
export type DateRange = {
  from: Date;
  to: Date;
} | null;

export type Filters = {
  period: Period;
  fromDate?: Date;
  toDate?: Date;
  category?: string[];
  search?: string;
};

export type TransactionFiltersFormValues = {
  period?: Period;
  fromDate?: Date;
  toDate?: Date;
  category?: string[];
  search?: string;
};

// *for statistics 
export type PeriodOption = {
  val: string;
  Icon: LucideIcon;
};

export type StatisticsByDateProps = {
  value: string;
  onChange: (value: string) => void;
};

export type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: {
      day: string;
      fullDate: string;
      amount: number | string;
      name: string;
      key?: string;
      val?: string;
    };
  }>;
  type?: string;
  className?: string;
  theme?: string;
};

// * dashboard 
export type CardItem = {
  type: 'INCOME' | 'EXPENSE' | 'BALANCE';
  total: number;
  date?: Date;
};