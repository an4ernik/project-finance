import {Controller, type Control} from 'react-hook-form';
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
import {INCOME_CATEGORY_OPTIONS} from './incomeCategoryOptions';

type Props = {
  control: Control<any>;
  error?: string;
};

export const IncomeCategoryField = ({control, error}: Props) => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Label className={cn('text-dark-background')}>
        {t('incomeModal.category')}*
      </Label>

      <Controller
        name="categoryId"
        control={control}
        render={({field}) => (
          <Select
            onOpenChange={open => !open && field.onBlur()}
            onValueChange={val => field.onChange(Number(val))}
            value={field.value ? String(field.value) : ''}
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
              {INCOME_CATEGORY_OPTIONS.map(({val, icon: Icon, id}) => {
                return (
                  <SelectItem key={val} value={String(id)}>
                    <div className="flex items-center gap-2 text-[16px]">
                      <Icon className="size-4 shrink-0" />
                      {t(`incomeModal.categories.${val}`)}
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
