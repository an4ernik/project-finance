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
import DisplayError from './DisplayError';
import {Button} from './button';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const btnRepeatActive = cn(
  'bg-[#015E4680] text-white font-medium',
  'dark:bg-[linear-gradient(0deg,#02624D_0%,#04C89E_100%)] dark:border-[#02624D]',
  'shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),0px_4px_10px_rgba(0,0,0,0.3)]',
);

const dateInput = cn(
  'flex items-center gap-2.5 rounded-[10px] border px-2.5 transition-all duration-200',
  '[box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] backdrop-blur-[32px]',
  'bg-linear-to-b from-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
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

const REPEAT_INCOME_TYPES = ['once', 'monthly', 'yearly'];

// --- Component ---
interface IncomeModalProps {
  title?: string;
  onClose: () => void;
}

const IncomeModal = ({title, onClose}: IncomeModalProps) => {
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
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="min-h-full flex items-center justify-center p-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col gap-2 max-w-[605px] w-full border rounded-3xl  text-dark-background shadow-xl my-auto bg-[#EEF3F2] dark:bg-secondary font-sans"
        >
          <div className='w-full p-6'>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <Label className="font-medium text-xl font-iter">
                {title ? title : t('incomeModal.titleCreate')}
              </Label>
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
                className={cn('h-10 sm:h-12 px-3 py-[7.5px]')}
                {...register('amount')}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <Label className={cn('text-dark-background')}>
                {t('incomeModal.category')}*
              </Label>
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
                      size="default"
                      classForIcon="opacity-100"
                      error={errors.category?.message}
                      hasValue={!!field.value}
                      className={cn(
                        'h-10 sm:h-12 text-[16px] min-w-full w-full justify-between shrink-0',
                      )}
                    >
                      <SelectValue
                        className="w-full"
                        placeholder={t(
                          'incomeModal.categories.categoryPlaceholder',
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent className="w-full">
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
              <DisplayError errorText={errors.category?.message} />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <Label className={cn('text-dark-background')}>
                {t('incomeModal.date')}*
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      dateInput,
                      'h-10 sm:h-12 cursor-pointer gap-1 hover:border-muted-foreground',
                    )}
                  >
                    <CalendarIcon
                      className={cn('size-5 text-dark-background')}
                    />
                    <span>
                      {format(watchedDate, 'd.MM.yyyy', {locale: uk})}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <ComponentCalendar
                    mode="single"
                    selected={watchedDate}
                    onSelect={d =>
                      d && setValue('date', d, {shouldValidate: true})
                    }
                    disabled={d =>
                      d.getTime() < new Date().setHours(0, 0, 0, 0)
                    }
                  />
                </PopoverContent>
              </Popover>
              <DisplayError errorText={errors.date?.message} />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 mb-8 sm:mb-10">
              <Label
                className={cn(
                  'text-[14px] sm:text-[16px] text-dark-background',
                )}
              >
                {t('incomeModal.description')}
              </Label>
              <Textarea
                {...register('description')}
                className={cn(
                  'h-19 py-3 resize-none data-[placeholder]:text-tertiary] text-[14px]',
                )}
                placeholder={t('incomeModal.descriptionPlaceholder')}
              />
            </div>

            {/* Repeat Selection */}
            <div className="flex flex-col gap-2 mb-7 sm:mb-[15px]">
              <Label
                className={cn(
                  'text-[14px] sm:text-[16px] text-dark-background',
                )}
              >
                {t('incomeModal.repeat.label')}
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {REPEAT_INCOME_TYPES.map(type => (
                  <Button
                    variant="secondary"
                    key={type}
                    type="button"
                    onClick={() =>
                      setValue('repeat', type, {shouldValidate: true})
                    }
                    className={cn(
                      'h-[47px] sm:h-[52px] tracking-tight text-dark-background cursor-pointer text-[14px]',
                      watchedRepeat === type && btnRepeatActive,
                    )}
                  >
                    {t(`incomeModal.repeat.${type}`)}
                  </Button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-2">
              <Label
                className={cn('text-xs sm:text-inherit text-dark-background')}
              >
                {t('incomeModal.upload.label')}
              </Label>
              <Button
                type="button"
                variant="secondary"
                className={cn(
                  'flex-row justify-center items-center py-6 cursor-pointer text-dark-background tracking-tight w-full',
                  errors.file?.message &&
                    'border border-destructive bg-destructive/10 hover:none!',
                )}
              >
                <label
                  className={cn(
                    'min-w-full min-h-12 flex items-center justify-center gap-2 cursor-pointer',
                  )}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                  <ArrowDownToLine className="size-4 mb-1 text-dark-background" />
                  <span className="text-sm truncate">
                    {watchedFile
                      ? watchedFile.name
                      : t('incomeModal.upload.action')}
                  </span>
                </label>
              </Button>
              <DisplayError
                errorText={
                  errors.file?.message
                    ? errors.file.message
                    : t('incomeModal.upload.hint')
                }
                className={cn(
                  errors.file?.message ? 'text-destructive' : 'text-[#6F7E7C]',
                )}
              />
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-center sm:justify-end gap-10 sm:gap-3 p-6 dark:border-t ">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className={cn(
                'w-[120px] h-[50px] sm:h-[36px] px-6 py-2 justify-center items-center transition-all cursor-pointer text-[14px] text-dark-background tracking-tight',
              )}
            >
              {t('incomeModal.actions.cancel')}
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={!isValid || !isDirty}
              className={cn(
                'w-[120px] h-[50px] sm:h-[36px] px-6 py-2 text-[14px] cursor-pointer tracking-tight',
              )}
            >
              {t('incomeModal.actions.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeModal;
