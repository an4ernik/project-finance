export const CURRENCY_SIGN = '₴';
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