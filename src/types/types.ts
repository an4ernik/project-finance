import type { LucideIcon } from "lucide-react";

export type ModalMode = 'create' | 'update';
export type ModalType = 'income' | 'expense';
export type RepeatType = 'this_only' | 'all_future';
export type TransactionType = 'income' | 'expense';
export const ALL_CATEGORIES_VALUE = 'allCategories';

//* transaction types
export type Transaction = {
  id?: number;
  description?: string;
  amount: number | string;
  categoryId: number;
  isRepeat?: string;
  date: Date | string;
  files?: File[];
};
 
export type TransactionUI = Transaction & {
  Icon: LucideIcon;
  isRepeat: string;
};

export type Props = {
  data: TransactionUI[];
  type: 'income' | 'expense';
};

// ==========================================================================

//* VirtualItem types and props
export interface Item {
  id?: number;
  description?: string;
  amount: number | string;
  categoryId: number;
  Icon: LucideIcon;
  isRepeat: string ;
  date: Date | string;
}
export interface VirtualItemProps {
  item: Item;
  type?: 'income' | 'expense';
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}
// ==========================================================================

// * Modal types and props


export interface IncomeFormData {
  id?: number;
  amount: number | string;
  categoryId: number;
  date: string | Date;
  isRepeat?: string;
  description?: string;
}

// ? mainModal
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  item: IncomeFormData | null;
  type?: 'income' | 'expense';
};

export interface MainModalData{
      id?: number;
      amount: number | string;
      categoryId: number;
      date: string | Date;
      description?: string;
      isRepeat?: string;
      repeatType?: RepeatType;
      files?: File[];
}

export interface IncomeModalProps {
  title?: string;
  type?: 'income' | 'expense';
  mode?: ModalMode;
  onClose: () => void;
  initialData?: MainModalData | null;
}
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
    category: string[];
    search: string;
};

export type TransactionFiltersFormValues = {
    period?: Period;
    fromDate?: Date;
    toDate?: Date;
    category?: string[];
    search?: string;
};
