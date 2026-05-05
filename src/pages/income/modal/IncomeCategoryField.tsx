
import {useTranslation} from 'react-i18next';

import {Label} from '@/components/ui/label';
import DisplayError from '@/components/ui/DisplayError';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {cn} from '@/lib/utils';
import type {TransactionType} from '@/types/types';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';
import {ICONS_BY_ID} from '../IconPicker';
import type {CategoryResponseDTO} from '@/shared/api/models';
import {Controller, type Control, type FieldValues, type Path} from 'react-hook-form';

type CategoryFieldValue = {
  categoryId: unknown;
};

type Props<T extends FieldValues & CategoryFieldValue> = {
  control: Control<T>;
  error?: string;
  type?: TransactionType;
};
 

export const IncomeCategoryField = <T extends FieldValues & CategoryFieldValue>({
  control,
  error,
  type = 'INCOME',
}: Props<T>) => {
  const {t} = useTranslation();
  const {data: categoriesResponse} = useGetCategories();
  const categoryItems = (
    Array.isArray(categoriesResponse)
      ? categoriesResponse
      : categoriesResponse?.data ?? []
  ) as CategoryResponseDTO[];

  const categories = categoryItems.filter(
    (
      category,
    ): category is CategoryResponseDTO & {
      id: number;
      name: string;
      icon: string;
    } =>
      category.id !== undefined &&
      category.name !== undefined &&
      category.icon !== undefined &&
      category.type === type,
  );

  return (
    <div className="flex flex-col gap-2">
      <Label className={cn('text-dark-background')}>
        {t(`incomeModal.fields.category.${type}`)}*
      </Label>

      <Controller
         name={'categoryId' as Path<T>}
        control={control}
        render={({field}) => (
          <Select
            onOpenChange={open => !open && field.onBlur()}
            onValueChange={val => field.onChange(Number(val))} 
            value={(field.value !== null && field.value !== undefined) ? String(field.value) : ''}
          >
            <SelectTrigger
              size="default"
              classForIcon="opacity-100"
              error={error}
              hasValue={!!field.value}
              className="h-10 sm:h-12 text-[16px] min-w-full w-full justify-between shrink-0"
            >
              <SelectValue
                className="w-full"
                placeholder={t('incomeModal.categories.categoryPlaceholder')}
              />
            </SelectTrigger>

            <SelectContent className="w-full">
              {categories.map(({name, icon, id}) => {
                const Icon = ICONS_BY_ID[icon];
                return (
                  <SelectItem key={id} value={String(id)}>
                    <div className="flex items-center gap-4 text-[16px]">
                      {Icon ? <Icon className="size-4 shrink-0" /> : null}
                      {name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />

      <DisplayError errorText={error} />
    </div>
  );
};

export default IncomeCategoryField;
