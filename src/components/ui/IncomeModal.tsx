import {useMemo} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslation} from 'react-i18next';
import z from 'zod';
import {format} from 'date-fns';
import {uk} from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  DollarSign,
  Percent,
  TrendingUp,
  X,
  MonitorCheck,
  ArrowDownToLine,
  type LucideIcon,
} from 'lucide-react';

import {cn} from '@/lib/utils';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import {Calendar as ComponentCalendar} from './calendar';
import {Input} from './input';
import {Label} from './label';
import {Textarea} from './textarea';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const baseGlassEffect = cn(
  'backdrop-blur-md dark:backdrop-blur-none transition-all duration-200',
  'bg-linear-to-b from-[rgba(49,95,85,0.1)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
  'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.35),0px_4px_4px_0px_rgba(75,75,75,0.25)] dark:shadow-none',
  'dark:from-[rgba(49,95,85,0.1)] dark:via-[rgba(49,95,85,0.1)] dark:to-[rgba(144,208,182,0.05)]',
  'dark:border-b dark:border-white/[0.14] dark:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]',
);

const baseGlassEffectLighter = cn(
  'bg-linear-to-b from-[rgba(49,95,85,0.1)] via-[#e0eae71a] to-[rgba(144,208,182,0.05)]',
  'dark:bg-linear-to-b from-[rgba(49,95,85,0.1)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
);

const inputBase = cn(
  'flex w-full items-center gap-2.5 rounded-[10px] border px-[12px] py-[7.5]',
  baseGlassEffect,
);

const btnRepeatBase = cn(
  inputBase,
  'h-12 justify-center cursor-pointer font-normal text-light-primary border-white/10',
  'hover:bg-[#015E4680]  dark:hover:border-b-none',
);

const btnRepeatActive = cn(
  'bg-[#015E4680] text-white font-medium',
  'dark:bg-[linear-gradient(0deg,#02624D_0%,#04C89E_100%)] dark:border-[#02624D]',
  'shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),0px_4px_10px_rgba(0,0,0,0.3)]',
);

const sendBtnBase = cn(
  'flex items-center justify-center gap-3.5 rounded-[10px] border transition-all duration-200 text-[16px] font-medium leading-[1.167] tracking-[-1.5px] disabled:opacity-50 disabled:cursor-not-allowed [background:var(--light-btn-bg-full)] text-[#eaf6f3] backdrop-blur-[5px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.3),0px_10px_26px_0px_rgba(0,0,0,0.2)] dark:[background:linear-gradient(to_bottom,rgba(49,95,85,0.55),rgba(49,95,85,0.18))] dark:backdrop-blur-[7px] dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)] dark:text-foreground hover:opacity-90 active:opacity-80 h-[36px] w-[120px] cursor-pointer',
);

type ActivityValue = 'salary' | 'freelance' | 'investments' | 'cashback';

interface Activity {
  val: ActivityValue;
  icon: LucideIcon;
}

const INCOME_TYPES: Activity[] = [
  {val: 'salary', icon: DollarSign},
  {val: 'freelance', icon: MonitorCheck},
  {val: 'investments', icon: Percent},
  {val: 'cashback', icon: TrendingUp},
];

// --- Component ---
interface IncomeModalProps {
  edit?: boolean;
  onClose: () => void;
}

const IncomeModal = ({edit, onClose}: IncomeModalProps) => {
  const {t} = useTranslation();

  const modalSchema = useMemo(
    () =>
      z.object({
        amount: z.preprocess(
          val => (val === '' ? undefined : Number(val)),
          z
            .number({
              message: t('incomeModal.errors.amountRequired'),
            })
            .min(0.01, t('incomeModal.errors.amountLessThanZero'))
            .max(1_000_000, t('incomeModal.errors.amountMax')),
        ),
        category: z.string().min(1, t('incomeModal.errors.categoryRequired')),
        date: z.date().refine(d => {
          const today = new Date().setHours(0, 0, 0, 0);
          return d.getTime() >= today;
        }, t('incomeModal.errors.noPastDates')),
        description: z.string().optional(),
        repeat: z.string(),
        file: z
          .instanceof(File)
          .refine(
            f => f.size <= MAX_FILE_SIZE,
            t('incomeModal.errors.fileSize'),
          )
          .refine(
            f => ACCEPTED_FILE_TYPES.includes(f.type),
            t('incomeModal.errors.fileType'),
          )
          .optional(),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    trigger,
    reset,
    formState: {errors, isDirty, isValid},
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(modalSchema),
    defaultValues: {amount: '', category: '', date: new Date(), repeat: 'once'},
  });

  const [watchedDate, watchedRepeat, watchedFile] = watch([
    'date',
    'repeat',
    'file',
  ]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file, {shouldValidate: true});
      await trigger('file');
    }
  };

  const onSubmit = async (data: z.infer<typeof modalSchema>) => {
    try {
      console.log('Sending data:', data);
      reset();
      onClose();
    } catch (error) {
      console.log(error);
      setError('file', {
        type: 'server',
        message: t('incomeModal.errors.uploadError'),
      });
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 max-w-150 w-full p-6 border rounded-3xl bg-secondary"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-medium text-xl font-iter">
            {edit ? t('incomeModal.titleEdit') : t('incomeModal.titleCreate')}
          </h2>
          <X
            className="size-5 cursor-pointer opacity-70 hover:opacity-100"
            onClick={onClose}
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <Input
            onKeyDown={e => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            min={0}
            type="number"
            label={t('incomeModal.amount') + '*'}
            placeholder="6000"
            error={!!errors.amount}
            errorMessage={errors.amount?.message}
            className={cn(
              'h-12 border-white/10 px-3 py-[7.5px] text-dark-background',
              baseGlassEffectLighter,
            )}
            {...register('amount')}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <Label>{t('incomeModal.category')}*</Label>
          <Controller
            name="category"
            control={control}
            render={({field}) => (
              <Select
                onOpenChange={open => !open && field.onBlur()}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger
                  className={cn(
                    inputBase,
                    'h-12 border-white/10 text-[16px]',
                    baseGlassEffectLighter,
                  )}
                >
                  <SelectValue
                    placeholder={t(
                      'incomeModal.categories.categoryPlaceholder',
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_TYPES.map(({val, icon: Icon}) => (
                    <SelectItem key={val} value={val}>
                      <div className="flex items-center gap-2 text-[16px]">
                        <Icon className="size-4 shrink-0" />{' '}
                        {t(`incomeModal.categories.${val}`)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <p className="text-[10px] leading-[1.167] text-destructive min-h-2.75">
            {errors.category?.message || ''}
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label>{t('incomeModal.date')}*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  inputBase,
                  'h-12 border-white/10 cursor-pointer gap-1',
                  baseGlassEffectLighter,
                )}
              >
                <CalendarIcon className="size-5 opacity-70" />
                <span>{format(watchedDate, 'd.MM.yyyy', {locale: uk})}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <ComponentCalendar
                mode="single"
                selected={watchedDate}
                onSelect={d => d && setValue('date', d, {shouldValidate: true})}
                disabled={d => d.getTime() < new Date().setHours(0, 0, 0, 0)}
              />
            </PopoverContent>
          </Popover>
          <p className="text-[10px] leading-[1.167] text-destructive min-h-2.75">
            {errors.date?.message || ''}
          </p>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2  mb-10">
          <Label>{t('incomeModal.description')}</Label>
          <Textarea
            {...register('description')}
            className={cn(
              inputBase,
              'h-19 py-3 resize-none placeholder:text-tertiary',
            )}
            placeholder={t('incomeModal.descriptionPlaceholder')}
          />
        </div>

        {/* Repeat Selection */}
        <div className="flex flex-col gap-2 mb-[15px]">
          <Label>{t('incomeModal.repeat.label')}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['once', 'monthly', 'yearly'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setValue('repeat', type, {shouldValidate: true})}
                className={cn(
                  btnRepeatBase,
                  watchedRepeat === type && btnRepeatActive,
                )}
              >
                {t(`incomeModal.repeat.${type}`)}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-2">
          <Label>{t('incomeModal.upload.label')}</Label>
          <label
            className={cn(
              inputBase,
              'flex-row justify-center items-center py-6 border-2 border-white/10 cursor-pointer hover:bg-white/5 h-12.5',
            )}
          >
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />
            <ArrowDownToLine className="size-6 mb-1 opacity-70" />
            <span className="text-sm truncate">
              {watchedFile ? watchedFile.name : t('incomeModal.upload.action')}
            </span>
          </label>
          <p
            className={cn(
              'text-[10px] leading-[1.167] min-h-2.75',
              errors.file ? 'text-destructive' : 'text-tertiary',
            )}
          >
            {errors.file?.message || t('incomeModal.upload.hint')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className={cn(
              inputBase,
              'w-[120px] h-[36px] px-6 py-2 justify-center items-center border-white/10   transition-all cursor-pointer text-[14px]',
            )}
          >
            {t('incomeModal.actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={!isValid || !isDirty}
            className={cn(sendBtnBase, 'px-6 py-2 text-[14px]')}
          >
            {t('incomeModal.actions.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeModal;
