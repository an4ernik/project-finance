export const currencySigns = {
  USD: '$',
  EUR: '€',
  UAH: '₴',
} as const;
export const DAY_KEYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
export const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

export const paths = [
  "/dashboard", "/income", "/expenses", "/settings",
  "/settings/security", "/settings/notifications",
  "/login", "/signup", "/forgot-password", "/reset-password",
  "/", "/Home", "/verify"
];

import { LayoutGridIcon, TrendingUp, TrendingDown, Cog } from 'lucide-react';

export const SIDEBAR_LINKS = [
  {
    to: "/dashboard",
    Icon: LayoutGridIcon,
    label: "sidebar.dashboard", // Store the translation key
  },
  {
    to: "/income",
    Icon: TrendingUp,
    label: "sidebar.income",
  },
  {
    to: "/expenses",
    Icon: TrendingDown,
    label: "sidebar.expenses",
  },
  {
    to: "/settings",
    Icon: Cog,
    label: "sidebar.settings",
  },
] as const;

export const TRANSACTION_THEMES = {
  INCOME: {
    container:
      'hover:bg-[#015E4680] dark:hover:bg-none dark:hover:bg-linear-to-b dark:hover:from-[#059979] dark:hover:to-[#02624D99]',
    bgIcon:
      'bg-[#005E4633] group-hover:bg-[#E6E6E6] dark:bg-[#00AA854D] dark:group-hover:bg-[#02A078]',
    textIcon: 'text-[#005E46] dark:text-[#EAF6F3]',
    textTitle: 'text-[#3A4A48] group-hover:text-[#E6E6E6] dark:text-[#BFD9D2]',
    subTitle: 'text-[#0B1514] group-hover:text-[#E6E6E6] dark:text-[#EAF6F3]',
    dateText: 'text-[#6F7E7C] group-hover:text-[#E6E6E6] dark:text-[#7F9E97]',
    repeatType:
      'bg-[#18B394] text-[#E6E6E6] dark:bg-[#315E55] dark:text-[#EAF6F3]',
    amountColor:
      'text-[#00AA85] group-hover:text-[#EAF6F3] dark:text-[#00AA85] dark:group-hover:text-[#EAF6F3]',
    editIconBg:
      'border border-[#E6E6E6] dark:border-[#e4e4e4]/20  bg-linear-to-b  from-[#0B151403] via-[#315F551A] to-[#90D0B60D]',
    editIconText: 'text-[#EAF6F3] dark:text-[#EAF6F3]',
    deleteIconBg:
      'bg-linear-to-t from-[#CE0000] to-[#C700004D] dark:from-[#CE0000] dark:to-[#C700004D]',
    deleteIconText: 'text-[#E6E6E6] dark:text-[#FFFFFF]',
    amountPrefix: '+',
  },

  EXPENSE: {
    container:
      'hover:bg-[#015E4680] dark:hover:bg-none dark:hover:bg-linear-to-b dark:hover:from-[#AA7D00] dark:hover:to-[#AA7D0033]',

    bgIcon: 'bg-[#005E4633] group-hover:bg-[#E6E6E6] dark:bg-[#AA7D0033]',
    textIcon:
      'text-[#005E46] dark:text-[#AA7D00] dark:group-hover:text-[#EAF6F3]',
    textTitle: 'text-[#3A4A48] group-hover:text-[#E6E6E6] dark:text-[#BFD9D2]',
    subTitle: 'text-[#0B1514] group-hover:text-[#E6E6E6] dark:text-[#EAF6F3]',
    dateText: 'text-[#9A8F80] group-hover:text-[#E6E6E6] dark:text-[#7F9E97]',
    repeatType:
      'bg-[#F4B24D] text-[#FFFFFF] dark:bg-[#AA7D00] dark:text-[#EAF6F3]',
    amountColor:
      'text-[#FF7C02CC] group-hover:text-[#EAF6F3] dark:text-[#AA7D00] dark:group-hover:text-[#EAF6F3]',
    editIconBg:
      'border blur-sm blur-[#E6E6E6] border-[#E6E6E6] dark:border-[#b0b0b0] dark:border-[#e4e4e4]/20 bg-linear-to-b from-[#0B151403] via-[#315F551A] to-[#90D0B60D] dark:bg-[rgba(234,246,243,0.14)]',
    editIconText: 'text-[#E6E6E6] dark:text-[#EAF6F3]',
    deleteIconBg:
      'bg-linear-to-t from-[#CE0000] to-[#C700004D] dark:from-[#CE0000] dark:to-[#C700004D]',
    deleteIconText: 'text-[#E6E6E6] dark:text-[#FFFFFF]',
    amountPrefix: '-',
  },
};

