import {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslation} from 'react-i18next';
import z from 'zod';
import {X} from 'lucide-react';
import {toast} from 'sonner';

import {Label} from '../../../components/ui/label';
import {Button} from '../../../components/ui/button';
import {cn} from '@/lib/utils';

import {useCreateTransaction} from '@/shared/api/generated/transaction-controller/transaction-controller';
// import {useUpdateTransaction} from '@/shared/api/generated/transaction-controller/transaction-controller';

import {IncomeAmountField} from './IncomeAmountField';
import {IncomeCategoryField} from './IncomeCategoryField';
import {IncomeDateField} from './IncomeDateField';
import {IncomeDescriptionField} from './IncomeDescriptionField';
import {IncomeRepeatField} from './IncomeRepeatField';
import {IncomeFileField} from './IncomeFileField';
import {useUpdateTransaction} from '@/shared/api/generated/transaction-management/transaction-management';
import Spinner from '@/components/Spinner';
import InfoDialog from './InfoDialog';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
] as const;

export type IncomeModalMode = 'create' | 'update';

export interface IncomeFormData {
  id?: number;
  amount: number;
  categoryId: number;
  date: string | Date;
  description?: string;
  repeat?: string;
  files?: File[];
}

interface IncomeModalProps {
  title?: string;
  mode?: IncomeModalMode;
  onClose: () => void;
  initialData?: IncomeFormData;
}

const modalWrapper = cn(
  'relative flex flex-col gap-2 max-w-[605px] w-full border rounded-3xl',
  'text-dark-background shadow-xl my-auto bg-[#EEF3F2] dark:bg-secondary font-sans',
);

const IncomeModal = ({
  mode = 'create',
  onClose,
  initialData,
}: IncomeModalProps) => {
  const {t} = useTranslation();

  const {mutateAsync: createIncome, isPending: isCreating} =
    useCreateTransaction();
  const {mutateAsync: updateIncome, isPending: isUpdating} =
    useUpdateTransaction();
  // SCHEMA
  const modalSchema = useMemo(
    () =>
      z.object({
        amount: z.preprocess(
          val => {
            if (val === '' || val === undefined) return undefined;

            const normalized = String(val).replace(',', '.');
            const num = Number(normalized);

            if (Number.isNaN(num)) return undefined;
            return Math.round(num * 100) / 100;
          },
          z
            .number({message: t('incomeModal.errors.amountRequired')})
            .min(0.01, t('incomeModal.errors.amountLessThanZero'))
            .max(1_000_000, t('incomeModal.errors.amountMax')),
        ),
        categoryId: z.coerce
          .number()
          .min(1, t('incomeModal.errors.categoryRequired')),
        date: z.date(),
        description: z.string().optional(),
        repeat: z.string().optional(),
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
            t('incomeModal.errors.fileType'),
          )
          .max(5, t('incomeModal.errors.maxFileCount'))
          .optional()
          .default([]),
      }),
    [t],
  );

  type FormValues = z.input<typeof modalSchema>;
  type FormOutput = z.infer<typeof modalSchema>;

  // Всередині компонента IncomeModal
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [pendingData, setPendingData] = useState<FormOutput | null>(null);
  const [scope, setScope] = useState<'this_only' | 'all_future'>('this_only');

  const getDefaultValues = (): FormValues => ({
    amount: initialData?.amount !== undefined ? String(initialData.amount) : '',
    categoryId: initialData?.categoryId,
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    repeat: initialData?.repeat ?? 'once',
    description: initialData?.description ?? '',
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
  } = useForm<FormValues, any, FormOutput>({
    mode: 'onBlur',
    resolver: zodResolver(modalSchema) as any,
    shouldFocusError: false,
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    reset(getDefaultValues());
  }, [initialData, mode, reset]);

  const watchedDate = watch('date');
  const watchedRepeat = watch('repeat');
  const watchedFile = watch('file') as File[] | undefined;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentFiles = watchedFile ?? [];

    const updated = [...currentFiles, ...newFiles].filter(
      (file, index, self) =>
        index === self.findIndex(f => f.name === file.name),
    );

    setValue('file', updated, {shouldValidate: true, shouldDirty: true});
    await trigger('file');
  };

  const removeFile = (fileName: string) => {
    const filteredFiles = (watchedFile ?? []).filter(f => f.name !== fileName);
    setValue('file', filteredFiles, {shouldValidate: true, shouldDirty: true});
    trigger('file');
  };

  const displayTitle =
    mode === 'update'
      ? t('incomeModal.titleEdit')
      : t('incomeModal.titleCreate');

  const executeMutation = async (
    data: FormOutput,
    // updateScope?: 'this_only' | 'all_future',
  ) => {
    try {
      if (mode === 'create') {
        await createIncome({
          data: {
            dto: {
              amount: data.amount,
              categoryId: data.categoryId,
              date: data.date.toISOString(),
              description: data.description || '',
              type: 'INCOME',
            },
            receipts: data.file ?? undefined,
          },
        });
        toast.success(t('incomeModal.successIncome.createIncome'),{id: 'success-create'});
      } else {
        if (!initialData?.id) return;

        await updateIncome({
          transactionId: initialData.id, 
          // params: { scope: updateScope },
          data: {
            amount: data.amount,
            categoryId: data.categoryId,
            date: data.date.toISOString(),
            description: data.description || '',
            type: 'INCOME',
          },
        });
        toast.success(t('incomeModal.successIncome.updateIncome'),{id: 'success'});
      }

      reset(getDefaultValues());
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t(`incomeModal.errors.${mode}IncomeError`),{id: 'error'});
    } finally {
      setShowInfoDialog(false);
      setPendingData(null);
    }
  };

  const handleInfoDialogClose = async (
    // selectedScope: 'this_only' | 'all_future' | null,
  ) => {
    if (  pendingData) {
      // Користувач підтвердив зміни
      await executeMutation(pendingData);
    } else {
      // Користувач скасував діалог
      setShowInfoDialog(false);
      setPendingData(null);
    }
  };

  const onSubmit = async (data: FormOutput) => {
    if (mode === 'update' && data.repeat !== 'once') {
      setPendingData(data);
      setShowInfoDialog(true);
      return;  
    }
 
    await executeMutation(data); 
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="min-h-full flex items-center justify-center p-3">
        <InfoDialog
          isOpen={showInfoDialog}
          onClose={handleInfoDialogClose}
          selectedScope={scope}
          setSelectedScope={setScope}
        />
        <form onSubmit={handleSubmit(onSubmit)} className={modalWrapper}>
          <div className="w-full p-6">
            <div className="flex justify-between items-center mb-8">
              <Label className="font-medium text-xl font-iter">
                {displayTitle}
              </Label>

              <X
                className="size-5 cursor-pointer opacity-70 hover:opacity-100"
                onClick={onClose}
              />
            </div>
            {/* AMOUNT */}
            <IncomeAmountField
              register={register}
              error={errors.amount?.message}
            />
            {/* CATEGORY */}
            <IncomeCategoryField
              control={control}
              error={errors.categoryId?.message}
            />
            {/* DATE */}
            <IncomeDateField
              value={watchedDate}
              error={errors.date?.message}
              onChange={(date: Date) =>
                setValue('date', date, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
            {/* DESCRIPTION */}
            <IncomeDescriptionField register={register} />
            {/* REPEAT */}
            <IncomeRepeatField
              value={watchedRepeat}
              onChange={(repeat: string) =>
                setValue('repeat', repeat, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
            {/* FILE */}
            <IncomeFileField
              files={watchedFile}
              error={errors.file?.message}
              onChange={handleFileChange}
              onRemove={removeFile}
            />
          </div>

          <div className="flex w-full  justify-center sm:justify-end gap-10 sm:gap-3 p-6 dark:border-t">
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
              variant="default"
              type="submit"
              disabled={!isValid || (mode === 'create' ? !isDirty : false)}
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

export default IncomeModal;
