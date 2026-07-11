import type {TFunction} from 'i18next';

import {
  CategoryResponseDTOScope,
  type CategoryResponseDTO,
} from '@/shared/api/models';

const DEFAULT_CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  salary: 'salary',
  зарплата: 'salary',
  заробітна_плата: 'salary',
  freelance: 'freelance',
  фріланс: 'freelance',
  gift: 'gift',
  present: 'gift',
  подарунок: 'gift',
  products: 'products',
  groceries: 'products',
  продукти: 'products',
  transport: 'transport',
  transportation: 'transport',
  транспорт: 'transport',
  cafe_and_restaurants: 'cafesAndRestaurants',
  cafe_and_restaurant: 'cafesAndRestaurants',
  cafeandrestaurants: 'cafesAndRestaurants',
  cafeandrestaurant: 'cafesAndRestaurants',
  cafes_and_restaurants: 'cafesAndRestaurants',
  cafesandrestaurants: 'cafesAndRestaurants',
  cafe_restaurants: 'cafesAndRestaurants',
  caferestaurants: 'cafesAndRestaurants',
  cafes_restaurants: 'cafesAndRestaurants',
  cafesrestaurants: 'cafesAndRestaurants',
  кафе_та_ресторани: 'cafesAndRestaurants',
  health: 'health',
  healthcare: 'health',
  "здоров'я": 'health',
  'здоров’я': 'health',
  clothing: 'clothing',
  clothes: 'clothing',
  одяг: 'clothing',
};

const normalizeCategoryName = (name?: string) =>
  name
    ?.trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_') ?? '';

export const isGlobalCategory = (category: CategoryResponseDTO) =>
  String(category.scope).toUpperCase() === CategoryResponseDTOScope.GLOBAL;

export const sortGlobalCategoriesFirst = <T extends CategoryResponseDTO>(
  categories: T[],
) =>
  [...categories].sort((first, second) => {
    const firstGlobal = isGlobalCategory(first);
    const secondGlobal = isGlobalCategory(second);

    if (firstGlobal === secondGlobal) return 0;
    return firstGlobal ? -1 : 1;
  });

export const getCategoryDisplayName = (
  category: CategoryResponseDTO,
  t: TFunction,
) => {
  if (!isGlobalCategory(category)) return category.name ?? '';

  const translationKey =
    DEFAULT_CATEGORY_TRANSLATION_KEYS[normalizeCategoryName(category.name)];

  return translationKey
    ? t(`defaultCategories.${translationKey}`)
    : (category.name ?? '');
};
