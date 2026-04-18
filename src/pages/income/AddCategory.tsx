import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'sonner';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {useQueryClient} from '@tanstack/react-query';

import {
  getGetCategoriesQueryKey,
  useCreateCategory,
} from '@/shared/api/generated/category-management/category-management';
import {CreateCategoryDTOType} from '@/shared/api/models/createCategoryDTOType';
import {GetCategoriesTypeItem} from '@/shared/api/models/getCategoriesTypeItem';

import IconPicker from './IconPicker';

type AddCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: GetCategoriesTypeItem;
};

function AddCategory({
  open,
  onOpenChange,
  type = GetCategoriesTypeItem.INCOME,
}: AddCategoryProps) {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const {mutate: createCategory, isPending} = useCreateCategory();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName('');
    setIcon(null);
    setError(null);
  }, [open]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t('income.addCategory.errors.nameRequired'));
      return;
    }
    if (!icon) {
      setError(t('income.addCategory.errors.iconRequired'));
      return;
    }
    setError(null);

    createCategory(
      {
        data: {
          name: trimmed,
          type: type as unknown as CreateCategoryDTOType,
          icon,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: getGetCategoriesQueryKey(),
          });
          toast.success(t('income.addCategory.success'));
          onOpenChange(false);
        },
        onError: (err: any) => {
          if (err?.response?.status === 409) {
            setError(t('income.addCategory.errors.duplicate'));
            return;
          }
          toast.error(t('income.addCategory.errors.createFailed'));
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        if (!next) setError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[342px] rounded-[10px] border border-white/[0.14] p-5 bg-[var(--glass-bg)] [box-shadow:var(--glass-shadow)] backdrop-blur-[24px]"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[24px] font-medium leading-[1.167]">
              {t('income.addCategory.title')}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-[16px] leading-[1.167] text-muted-foreground">
              {t('income.addCategory.nameLabel')}
            </label>
            <Input
              placeholder={t('income.addCategory.namePlaceholder')}
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] leading-[1.167] text-muted-foreground">
              {t('income.addCategory.iconLabel')}
            </label>
            <IconPicker
              value={icon}
              onChange={setIcon}
              columns={5}
              buttonClassName="size-11 rounded-[10px]"
              iconClassName="size-5"
            />
          </div>

          {error && (
            <p className="text-[10px] leading-[1.167] text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="mt-2 flex-row justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 w-[140px]"
            variant="secondary"
          >
            {t('income.addCategory.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="h-9 w-[140px]"
          >
            {isPending
              ? t('income.addCategory.saving')
              : t('income.addCategory.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCategory;
