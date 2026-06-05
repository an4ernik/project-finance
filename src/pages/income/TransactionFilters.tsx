import {
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarSearch,
  ChevronDown,
  Clock3,
  History,
  Search,
} from 'lucide-react';

import {useState} from 'react';
import {Calendar as ComponentCalendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {uk} from 'date-fns/locale';
import {Button} from '@/components/ui/button';

import {Checkbox} from '@/components/ui/checkbox';
import {Field, FieldGroup, FieldLabel} from '@/components/ui/field';

const dropdownClass = cn(
  'p-4 rounded-[10px], min-w-[240px] w-full tracking-tight',
  'bg-[#EEF3F2] text-foreground',
  'dark:bg-[#142624] dark:text-[#7F9E97]',
);

import {Input} from '@/components/ui/input';
import type {UseFormReturn} from 'react-hook-form';
import {
  ALL_CATEGORIES_VALUE,
  type PeriodOptions,
  type TransactionFiltersFormValues,
  type TransactionType,
} from '@/types/types';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';
import type {CategoryResponseDTO} from '@/shared/api/models';
import {ICONS_BY_ID} from './IconPicker';

const PERIOD_OPTIONS: PeriodOptions[] = [
  {val: 'all', icon: Calendar},
  {val: 'today', icon: Clock3},
  {val: 'week', icon: History},
  {val: 'month', icon: CalendarDays},
  {val: 'year', icon: CalendarClock},
  {val: 'custom', icon: CalendarSearch},
];

type Props = {
  form: UseFormReturn<TransactionFiltersFormValues>;
  type?: TransactionType;
};

const TransactionFilters = ({form, type = 'INCOME'}: Props) => {
  const {data: responseCategories} = useGetCategories();
  const categoryItems = Array.isArray(responseCategories)
    ? responseCategories
    : [];

  const categories = categoryItems.filter(
    (
      category,
    ): category is CategoryResponseDTO & {name: string; icon: string} =>
      category.name !== undefined &&
      category.icon !== undefined &&
      category.type === type,
  );

  const {control, watch, register, setValue} = form;
  const {t} = useTranslation();
  const [periodOpen, setPeriodOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const {period, fromDate, toDate, category = [ALL_CATEGORIES_VALUE]} = watch();

  const selectedCategories = categories?.filter(cat =>
    category.includes(cat.name),
  );

  const selectedCategoriesLabel = category.includes(ALL_CATEGORIES_VALUE)
    ? t(`incomeModal.filters.category.${ALL_CATEGORIES_VALUE}`)
    : selectedCategories.map(cat => cat.name).join(', ') || '';

  const selectedPeriod =
    PERIOD_OPTIONS.find(item => item.val === period) ?? PERIOD_OPTIONS[0];

  const SelectedPeriodIcon = selectedPeriod.icon;

  return (
    <div className="w-full bg-secondary flex-wrap flex flex-col sm:flex-row  gap-7 dark:border-b dark:border-[#434e4b]">
      {/* Period filter */}
      <div className="flex flex-col gap-2 w-full lg:max-w-[240px] md:flex-1 md:min-w-[200px]">
        <h2 className='text-[#BFD9D2]'>{t('incomeModal.filters.period.label')}</h2>
        <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={categories?.length === 0}
              variant="tab"
              className={cn(
                'flex h-10 w-full shadow-md border-black/10 dark:border-white/10 text-[#6F7E7C] dark:text-[#A9C1BB] items-center justify-between px-4 truncate',
              )}
            >
              <div className="flex justify-between items-center w-full gap-2">
                <div className="flex items-center gap-2.5">
                  <SelectedPeriodIcon className="size-4 text-[#6F7E7C] dark:text-[#A9C1BB]" />
                  <span className="tracking-tight">
                    {period === 'custom' && fromDate && toDate
                      ? `${format(fromDate, 'dd.MM.yy')} - ${format(toDate, 'dd.MM.yy')}`
                      : t(`incomeModal.filters.period.${period}`)}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'transition-transform duration-200',
                    periodOpen && 'rotate-180',
                  )}
                />
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className={cn(
              dropdownClass,
              'border bg-[#EEF3F2] dark:bg-[#122421] px-2 py-2 text-[#A9C1BB] shadow-sm dark:text-[#A9C1BB] overflow-y-auto',
            )}
            align="start"
          >
            <div className="flex flex-col w-full gap-2.5">
              <Controller
                control={control}
                name="period"
                render={({field}) => (
                  <FieldGroup
                    className={cn(
                      'gap-2 border-[#dadddd] dark:border-[#434e4b]',
                      period === 'custom' && 'border-b pb-4',
                    )}
                  >
                    {PERIOD_OPTIONS.map(item => {
                      const isSelected = field.value === item.val;
                      const ItemIcon = item.icon;

                      return (
                        <Field
                          key={item.val}
                          orientation="horizontal"
                          className={cn(
                            'flex items-center gap-3 rounded-[12px] px-4 py-2 cursor-pointer transition-all',
                            isSelected
                              ? 'border dark:border-[#4B6560] dark:bg-[linear-gradient(180deg,rgba(27,52,47,0.95)_0%,rgba(19,37,34,0.98)_100%)] !text-[#0B1514] dark:!text-[#EAF6F3] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(125,164,154,0.08),0_10px_24px_rgba(0,0,0,0.2)]'
                              : 'border border-transparent text-[#7F9E97] hover:bg-[#0B151403] hover:via-[#315F551A] hover:shadow-md dark:hover:bg-[#17302c]',
                          )}
                          onClick={() => {
                            field.onChange(item.val);

                            if (item.val !== 'custom') {
                              setValue('fromDate', undefined, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              setValue('toDate', undefined, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              setPeriodOpen(false);
                            } else {
                              setPeriodOpen(true);
                            }
                          }}
                        >
                          <FieldLabel
                            className={cn(
                              'flex flex-1 cursor-pointer items-center gap-3 text-[16px] font-normal',
                              isSelected
                                ? '!text-[#0B1514] dark:!text-[#EAF6F3]' // 🎯 Теж виправлено знаки "!"
                                : 'text-[#7F9E97]',
                            )}
                          >
                            <ItemIcon
                              className={cn(
                                'size-[18px]',
                                isSelected
                                  ? '!text-[#0B1514] dark:!text-[#EAF6F3]'
                                  : 'text-[#6D8D87]',
                              )}
                            />
                            {t(`incomeModal.filters.period.${item.val}`)}
                          </FieldLabel>
                        </Field>
                      );
                    })}
                  </FieldGroup>
                )}
              />

              {period === 'custom' && (
                <div
                  className="flex flex-col items-center gap-3"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Календар FROM */}
                  <div className="flex flex-col w-full gap-1.5">
                    <label className="text-[14px] text-[#3A4A48] dark:text-[#BFD9D2] ml-1">
                      {t('incomeModal.filters.period.from')}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="tab"
                          type="button"
                          className={cn(
                            'h-9 px-[16px] py-2.5 justify-start text-[#0B1514] dark:text-[#EAF6F3]',
                          )}
                        >
                          <CalendarDays className="size-4" />
                          {fromDate
                            ? format(fromDate, 'dd.MM.yyyy')
                            : t('incomeModal.filters.period.date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        side="right"
                        align="start"
                        onClick={e => e.stopPropagation()}
                      >
                        <Controller
                          control={control}
                          name="fromDate"
                          render={({field}) => (
                            <ComponentCalendar
                              disabled={(date: Date) => date > new Date()}
                              mode="single"
                              selected={
                                field.value instanceof Date
                                  ? field.value
                                  : undefined
                              }
                              onSelect={field.onChange}
                              locale={uk}
                            />
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Календар TO */}
                  <div className="flex flex-col w-full gap-1.5">
                    <label className="text-[14px] text-[#3A4A48] dark:text-[#BFD9D2] ml-1">
                      {t('incomeModal.filters.period.to')}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          disabled={!fromDate}
                          variant="tab"
                          type="button"
                          className={cn(
                            'h-9 px-4 py-2.5 justify-start text-[#0B1514] dark:text-[#EAF6F3] disabled:bg-none! disabled:text-[#6F7E7C] disabled:dark:text-[#7F9E97] disabled:border-none disabled:cursor-default',
                          )}
                        >
                          <CalendarDays className="size-4 text-inherit hover:text-primary" />
                          {toDate instanceof Date
                            ? format(toDate, 'dd.MM.yyyy')
                            : t('incomeModal.filters.period.date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 text-[#6F7E7C]"
                        side="right"
                        align="start"
                        onClick={e => e.stopPropagation()}
                      >
                        <Controller
                          control={control}
                          name="toDate"
                          render={({field}) => (
                            <ComponentCalendar
                              disabled={(date: Date) => {
                                const isFuture = date > new Date();
                                const isBeforeFrom = fromDate
                                  ? date < fromDate
                                  : false;
                                return isFuture || isBeforeFrom;
                              }}
                              mode="single"
                              selected={
                                field.value instanceof Date
                                  ? field.value
                                  : undefined
                              }
                              onSelect={date => {
                                field.onChange(date);
                                if (date) {
                                  setPeriodOpen(false);
                                }
                              }}
                              locale={uk}
                            />
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* categories */}
      <div className="flex flex-col gap-2 w-full lg:max-w-[240px] md:flex-1 md:min-w-[200px]">
        <h2 className='text-[#BFD9D2]'>{t('incomeModal.filters.category.label')}</h2>

        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={categories?.length === 0}
              variant="tab"
              type="button"
              className={cn(
                'shadow-md border-black/10 dark:border-white/10',
                'flex h-10 px-4 w-full items-center justify-between text-[#6F7E7C] dark:text-[#A9C1BB]',
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="truncate tracking-tight">
                  {selectedCategoriesLabel}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'transition-transform duration-200 shrink-0',
                  categoryOpen && 'rotate-180',
                )}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="max-w-[240px] rounded-[12px] py-3 px-3 bg-[#EEF3F2] dark:bg-[#142624]"
            align="start"
            sideOffset={8}
          >
            <Controller
              control={control}
              name="category"
              render={({field}) => (
                <FieldGroup className="gap-2">
                  {categories?.map(item => {
                    const selectedValues = field.value ?? [
                      ALL_CATEGORIES_VALUE,
                    ];
                    const isChecked = selectedValues.includes(item.name);
                    const Icon = ICONS_BY_ID[item.icon];

                    const toggleCategory = (checked: boolean) => {
                      if (item.name === ALL_CATEGORIES_VALUE) {
                        field.onChange(
                          checked ? [ALL_CATEGORIES_VALUE] : selectedValues,
                        );
                        return;
                      }

                      const nextValues = checked
                        ? [
                            ...selectedValues.filter(
                              value => value !== ALL_CATEGORIES_VALUE,
                            ),
                            item.name,
                          ]
                        : selectedValues.filter(value => value !== item.name);

                      field.onChange(
                        nextValues.length ? nextValues : [ALL_CATEGORIES_VALUE],
                      );
                    };

                    return (
                      <Field
                        key={item.name}
                        orientation="horizontal"
                        className={cn(
                          'flex items-center gap-3 rounded-[12px] px-4 py-2 cursor-pointer transition-all truncate',
                          isChecked
                            ? 'border dark:border-[#4B6560] dark:bg-[linear-gradient(180deg,rgba(27,52,47,0.95)_0%,rgba(19,37,34,0.98)_100%)] text-[#EAF6F3] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(125,164,154,0.08),0_10px_24px_rgba(0,0,0,0.2)]'
                            : 'border border-transparent text-[#7F9E97] hover:bg-linear-to-b hover: hover:bg-[#0B151403] hover:via-[#315F551A] hover:shadow-xs hover:to-[#90D0B60D] dark:hover:bg-[#17302c]',
                        )}
                        onClick={() => toggleCategory(!isChecked)}
                      >
                        <Checkbox
                          id={`cat-${item.name}`}
                          checked={isChecked}
                          onClick={e => e.stopPropagation()}
                          onCheckedChange={checked =>
                            toggleCategory(checked === true)
                          }
                          className="size-4 bg-white! rounded-sm data-[state=checked]:bg-[#171717]! dark:border-none!"
                        />

                        <FieldLabel className="pointer-events-none flex flex-1 items-center gap-2 text-sm font-normal truncate">
                          {Icon ? (
                            <Icon className="size-5 text-[#6F7E7C] dark:text-[#7F9E97]" />
                          ) : null}
                          {item.name}
                        </FieldLabel>
                      </Field>
                    );
                  })}
                </FieldGroup>
              )}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* search */}
      <div className="flex flex-col gap-2 w-full lg:max-w-[320px] md:flex-1 md:min-w-[200px]">
        <h2 className='text-[#BFD9D2]'>{t('incomeModal.filters.search.label')}</h2>
        <Input
          disabled={categories?.length === 0}
          className="text-[#6F7E7C] shadow-md border-black/10 dark:border-white/10 dark:text-[#A9C1BB] placeholder:text-[#6F7E7C] dark:placeholder:text-[#A9C1BB] tracking-normal"
          icon={
            <Search className="size-5 text-[#0B1514] dark:text-[#EAF6F3]" />
          }
          placeholder={t(`incomeModal.filters.search.placeholder.${type}`)}
          type="text"
          {...register('search')}
        />
      </div>
    </div>
  );
};
export default TransactionFilters;
