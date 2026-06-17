import {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslation} from 'react-i18next';
import z from 'zod';
import {OctagonAlert, X} from 'lucide-react';
import {toast} from 'sonner';

import {Button} from '../../../components/ui/button';
import {cn} from '@/lib/utils';

import {useCreateTransaction} from '@/shared/api/generated/transaction-controller/transaction-controller';

import {IncomeAmountField} from './IncomeAmountField';
import {IncomeCategoryField} from './IncomeCategoryField';
import {IncomeDateField} from './IncomeDateField';
import {IncomeDescriptionField} from './IncomeDescriptionField';
import {IncomeRepeatField} from './IncomeRepeatField';
import {IncomeFileField} from './IncomeFileField';
import {useUpdateTransaction} from '@/shared/api/generated/transaction-management/transaction-management';

import Spinner from '@/components/Spinner';
import InfoDialog, {type RecurringUpdateScope} from './InfoDialog';
import type {IncomeModalProps} from '@/types/types';
import {toTransactionDtoType} from '@/helpers/helpers';
import {format} from 'date-fns';
import {useQueryClient} from '@tanstack/react-query';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
] as const;

const modalWrapper = cn(
  'relative flex flex-col gap-2 max-w-[605px] w-full border rounded-3xl',
  'text-dark-background shadow-xl my-auto bg-[#EEF3F2] dark:bg-secondary font-sans',
);

const TransactionModal = ({
  mode = 'create',
  onClose,
  initialData,
  type = 'INCOME',
}: IncomeModalProps) => {
  const {t} = useTranslation();

  const queryClient = useQueryClient();
  const mutationConfig = {
    mutation: {
      onSuccess: () => {
        queryClient.resetQueries({
          queryKey: ['/api/v1/transactions'],
          exact: false,
        });
      },
    },
  };

  const {mutateAsync: createIncome, isPending: isCreating} =
    useCreateTransaction(mutationConfig);
  const {mutateAsync: updateIncome, isPending: isUpdating} =
    useUpdateTransaction(mutationConfig);

  // SCHEMA
  const modalSchema = useMemo(
    () =>
      z.object({
        amount: z
          .preprocess(
            val => {
              if (val === '' || val === undefined) return undefined;

              const normalized = String(val).replace(',', '.');
              const num = Number(normalized);

              if (Number.isNaN(num)) return undefined;
              return Math.floor(num * 100) / 100;
            },
            z
              .number({message: t(`incomeModal.errors.amountRequired.${type}`)})
              .min(0.01, t(`incomeModal.errors.amountLessThanZero.${type}`))
              .max(
                999_999_999_999.99,
                t(`incomeModal.errors.amountMax.${type}`),
              ),
          )
          .transform(val => Number(val.toFixed(2))),
        categoryId: z.coerce
          .number({
            message: t(`incomeModal.errors.categoryRequired.${type}`),
          })
          .refine(val => !isNaN(val) && val >= 1, {
            message: t(`incomeModal.errors.categoryRequired.${type}`),
          }),
        date: z.date(),
        description: z
          .string()
          .optional()
          .transform(val => {
            if (!val) return val;
            return val
              .replace(/\r?\n|\r/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 256);
          }),
        intervalUnit: z.enum(['ONCE', 'MONTHLY', 'YEARLY']).optional(),
        file: z
          .array(z.instanceof(File))
          .refine(
            files => files.every(f => f.size <= MAX_FILE_SIZE),
            t('incomeModal.errors.fileSize'),
          )
          .refine(
            files =>
              files.every(f =>
                ACCEPTED_FILE_TYPES.includes(
                  f.type as (typeof ACCEPTED_FILE_TYPES)[number],
                ),
              ),
            t('incomeModal.errors.fileFormat'),
          )
          .max(5, t('incomeModal.errors.maxFileCount'))
          .optional()
          .default([]),
      }),
    [t, type],
  );

  type FormValues = z.input<typeof modalSchema>;
  type FormOutput = z.infer<typeof modalSchema>;

  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [pendingData, setPendingData] = useState<FormOutput | null>(null);
  const [scope, setScope] = useState<'ONLY_THIS' | 'THIS_AND_FUTURE'>(
    'ONLY_THIS',
  );

  const getDefaultValues = (): FormValues => ({
    amount: initialData?.amount !== undefined ? String(initialData.amount) : '',
    categoryId: initialData?.categoryId ?? initialData?.category?.id,
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    intervalUnit: initialData?.intervalUnit ?? 'ONCE',
    description: initialData?.description?.slice(0, 256) ?? '',
    file: initialData?.files ?? [],
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: {errors, isDirty, isValid},
  } = useForm<FormValues, FormValues, FormOutput>({
    mode: 'onBlur',
    resolver: zodResolver(modalSchema),
    shouldFocusError: false,
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    reset(getDefaultValues());
  }, [initialData, mode, reset]);

  const watchedDate = watch('date');
  const watchedRepeat = watch('intervalUnit');
  const watchedFile = watch('file') as File[] | undefined;
  const watchedDescription = watch('description');

  useEffect(() => {
    if (!watchedDescription) return;

    const hasLineBreaks = /\r?\n|\r/.test(watchedDescription);
    const hasDoubleSpaces = /\s{2,}/.test(watchedDescription);

    if (hasLineBreaks || hasDoubleSpaces) {
      const normalizedDescription = watchedDescription
        .replace(/\r?\n|\r/g, ' ')
        .replace(/\s+/g, ' ');
      setValue('description', normalizedDescription, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchedDescription, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentFiles = watchedFile ?? [];

    const updated = [...currentFiles, ...newFiles]
      .filter(
        (file, index, self) =>
          index === self.findIndex(f => f.name === file.name),
      )
      .slice(0, 6);

    setValue('file', updated, {shouldValidate: true, shouldDirty: true});
    await trigger('file');
  };

  const removeFile = (fileName: string) => {
    const filteredFiles = (watchedFile ?? []).filter(f => f.name !== fileName);
    setValue('file', filteredFiles, {shouldValidate: true, shouldDirty: true});
    trigger('file');
  };

  const displayTitle = t(`incomeModal.title.${mode}.${type}`);

  const executeMutation = async (
    data: FormOutput,
    currentScope?: 'ONLY_THIS' | 'THIS_AND_FUTURE',
  ) => {
    const isInitiallyRecurring =
      mode === 'update'
        ? initialData?.intervalUnit && initialData?.intervalUnit !== 'ONCE'
        : data.intervalUnit && data.intervalUnit !== 'ONCE';

    try {
      if (mode === 'create') {
        if (data.intervalUnit && data.intervalUnit === 'ONCE') {
          await createIncome({
            data: {
              dto: {
                amount: data.amount,
                type: toTransactionDtoType(type),
                categoryId: data.categoryId,
                date: format(data.date, 'yyyy-MM-dd'),
                description: data.description || '',
                intervalUnit: data.intervalUnit,
              },
              receipts: data.file ?? undefined,
            },
          });
        } else {
          await createIncome({
            data: {
              dto: {
                amount: data.amount,
                type: toTransactionDtoType(type),
                categoryId: data.categoryId,
                date: format(data.date, 'yyyy-MM-dd'),
                description: data.description || '',
                intervalUnit: data.intervalUnit,
              },
            },
          });
        }
        toast.success(t(`incomeModal.transaction.success.create.${type}`), {
          id: 'success-create',
        });
      } else {
        if (!initialData?.id) return;

        if (isInitiallyRecurring) {
          await updateIncome({
            id: initialData.id,
            data: {
              amount: data.amount,
              categoryId: data.categoryId,
              date: format(data.date, 'yyyy-MM-dd'),
              description: data.description || '',
              transactionChangeScope: currentScope || scope,
            },
          });
        } else {
          await updateIncome({
            id: initialData.id,
            data: {
              amount: data.amount,
              categoryId: data.categoryId,
              date: format(data.date, 'yyyy-MM-dd'),
              description: data.description || '',
            },
          });
        }

        toast.success(t(`incomeModal.transaction.success.update.${type}`), {
          id: 'success-update',
        });
      }

      reset(getDefaultValues());
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t(`incomeModal.transaction.error.${mode}.${type}`), {
        id: 'error',
      });
    } finally {
      setShowInfoDialog(false);
      setPendingData(null);
    }
  };
  const handleInfoDialogClose = async (
    selectedScope: RecurringUpdateScope | null,
  ) => {
    if (selectedScope && pendingData) {
      setScope(selectedScope as 'ONLY_THIS' | 'THIS_AND_FUTURE');
      await executeMutation(
        pendingData,
        selectedScope as 'ONLY_THIS' | 'THIS_AND_FUTURE',
      );
    } else {
      setShowInfoDialog(false);
      setPendingData(null);
    }
  };

  const onSubmit = async (data: FormOutput) => {
    if (mode === 'update' && !isDirty) {
      return;
    }
    if (
      mode === 'update' &&
      data.intervalUnit &&
      data?.intervalUnit !== 'ONCE'
    ) {
      setPendingData(data);
      setShowInfoDialog(true);
      return;
    }

    await executeMutation(data);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [prevRepeat, setPrevRepeat] = useState(watchedRepeat);

  useEffect(() => {
    if (!watchedDate) return;

    const selectedDate = new Date(watchedDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (mode === 'update' && watchedRepeat === initialData?.intervalUnit) {
      return;
    }

    if (watchedRepeat !== prevRepeat) {
      if (watchedRepeat !== 'ONCE' && selectedDate < today) {
        setValue('date', today, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (watchedRepeat === 'ONCE' && selectedDate > today) {
        setValue('date', today, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      setPrevRepeat(watchedRepeat);
    }
  }, [watchedRepeat, watchedDate, setValue, mode, initialData, prevRepeat]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm scrollbar-hide">
      <div className="min-h-full flex items-center justify-center p-3">
        <InfoDialog
          isOpen={showInfoDialog}
          onClose={handleInfoDialogClose}
          selectedScope={scope}
          setSelectedScope={setScope}
          type={type}
        />

        <form onSubmit={handleSubmit(onSubmit)} className={modalWrapper}>
          <div className="w-full p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-medium text-xl font-iter">{displayTitle}</h2>

              <button
                type="button"
                onClick={onClose}
                className="opacity-70 hover:opacity-100 p-1 transition-opacity cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* AMOUNT */}
            <IncomeAmountField
              name="amount"
              type={type}
              register={register}
              error={errors.amount?.message}
            />

            {/* CATEGORY */}
            <IncomeCategoryField
              type={type}
              control={control}
              error={errors.categoryId?.message}
            />

            {/* DATE */}
            <IncomeDateField
              type={type}
              value={watchedDate}
              error={errors.date?.message}
              disabledDate={(date: Date) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);

                const currentToday = new Date(today);
                currentToday.setHours(0, 0, 0, 0);

                if (mode === 'update' && watchedRepeat !== 'ONCE') {
                  const startOfMonth = new Date(
                    currentToday.getFullYear(),
                    currentToday.getMonth(),
                    1,
                  );

                  return d < startOfMonth || d > today;
                }

                if (watchedRepeat === 'ONCE') {
                  return d > currentToday;
                }
                return d < currentToday;
              }}
              onChange={(date: Date) =>
                setValue('date', date, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />

            {/* DESCRIPTION */}
            <IncomeDescriptionField
              register={register}
              inputValue={watchedDescription}
            />

            {/* REPEAT */}
            <IncomeRepeatField
              value={watchedRepeat}
              mode={mode}
              onChange={(repeat: 'ONCE' | 'MONTHLY' | 'YEARLY') => {
                if (mode !== 'update')
                  setValue('intervalUnit', repeat, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
              }}
            />

            <div
              className={cn(
                'overflow-hidden transition-all duration-400 ease-in-out',
                watchedRepeat !== 'ONCE' && mode !== 'update'
                  ? 'max-h-40 opacity-100 translate-y-0 my-2'
                  : 'max-h-0 opacity-0 -translate-y-2 my-2',
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-8 text-dark-background w-full p-3 shadow-sm border dark:border-slate-100/90 rounded-lg',
                )}
              >
                <OctagonAlert className="size-8 shrink-0" />

                <div>
                  <p>{t('incomeModal.intervalUnitAlert.title')}</p>

                  <p className="text-[12px] dark:text-[#BFD9D2]">
                    {t('incomeModal.intervalUnitAlert.subtitle')}
                  </p>
                </div>
              </div>
            </div>

            {/* FILE */}
            <IncomeFileField
              files={watchedFile}
              error={errors.file?.message}
              onChange={handleFileChange}
              onRemove={removeFile}
              repeat={watchedRepeat as 'ONCE' | 'MONTHLY' | 'YEARLY'}
              mode={mode}
              disabled={watchedRepeat !== 'ONCE' && mode !== 'update'}
            />
          </div>

          <div className="flex w-full justify-center sm:justify-end gap-10 sm:gap-3 p-6 dark:border-t">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                reset(getDefaultValues());
                onClose();
              }}
              className="w-[120px] h-[50px] sm:h-[36px] px-6 py-2 text-[14px] text-dark-background tracking-tight"
            >
              {t('incomeModal.actions.cancel')}
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={!isValid || !isDirty || isCreating || isUpdating}
              className="w-[120px] h-[50px] sm:h-[36px] px-6 py-2 text-[14px] tracking-tight"
            >
              {isCreating || isUpdating ? (
                <Spinner />
              ) : (
                t('incomeModal.actions.save')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
