import {
    CalendarClock,
    CalendarDays,
    History,
    type LucideIcon,
} from 'lucide-react';

import type { DateRange, Filters, PeriodOption, TransactionType, TransactionUI } from '@/types/types';
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    isWithinInterval,
    parseISO,
} from 'date-fns';

export const REPEAT_TYPES = ['once', 'yearly', 'monthly'];

export const PERIOD_OPTIONS: PeriodOption[] = [
    { val: 'week', Icon: History },
    { val: 'month', Icon: CalendarDays },
    { val: 'year', Icon: CalendarClock },
];

export const toTransactionDtoType = (type: TransactionType) => type;


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
export const getPeriodRange = (filters: Partial<Filters>): DateRange => {
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
                // to: now,
            };

        case 'month':
            return {
                from: startOfMonth(now),
                to: endOfMonth(now),
                // to: now,
            };

        case 'year':
            return {
                from: startOfYear(now),
                to: endOfYear(now),
                // to: now,
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
 

export const applyFilters = (
    items: TransactionUI[],
    filters: Filters,
    search: string
) => {
    let result = [...items]; 

    // 🔍 SEARCH
    if (search) {
        const normalized = search.toLowerCase();

        result = result.filter(item =>
            (item.description ?? "")
                .toLowerCase()
                .includes(normalized)
        );
    }

    // 🗂 CATEGORY FILTER
    if (
        filters.category &&
        !filters.category.includes("allCategories")
    ) {
        result = result.filter(item =>
            filters.category && filters.category.includes(String(item.category?.name))
        );
    }

    // 📅 DATE FILTER
    const range = getPeriodRange(filters);

    if (range?.from && range?.to) {
        result = result.filter(item => {
            const date = typeof item.date === 'string' ? parseISO(item.date) : item.date;
            return isWithinInterval(date, {
                start: range.from,
                end: range.to,
            });
        });
    }

    return result;
};

// * get category by id, categories for income and expense
export interface CategoryOption {
    val: string;
    icon: LucideIcon;
    id: number;
}
 
export const getColors = (length: number): string[] => {
  // 1. Define the starting colors exactly as seen in your image
  const baseColors = [
    "hsl(24, 95%, 53%)",  // Vibrant Orange
    "hsl(45, 95%, 50%)",  // Golden Yellow
    "hsl(85, 75%, 50%)",  // Lime Green
    "hsl(190, 80%, 50%)", // Cyan/Light Blue
    "hsl(262, 70%, 65%)", // Soft Purple
    "hsl(150, 70%, 45%)", // Sea Green
    "hsl(330, 80%, 60%)", // Pink/Magenta
  ];

  return Array.from({ length }, (_, i) => {
    // 2. If the index is within our base colors, use them
    if (i < baseColors.length) {
      return baseColors[i];
    }

    // 3. For any extra categories, generate distinct HSL colors
    // We offset the index so it doesn't repeat the same hues as above immediately
    const hue = ((i - baseColors.length) * 137.5 + 200) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  });
};
