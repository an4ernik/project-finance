import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'sonner';
import {isAxiosError} from 'axios';

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

import type {CategoryResponseDTO} from '@/shared/api/models';
import {GetCategoriesTypeItem} from '@/shared/api/models/getCategoriesTypeItem';
import {
  getGetCategoriesQueryKey,
  useUpdateCategory,
} from '@/shared/api/generated/category-management/category-management';

import IconPicker from './IconPicker';

type EditCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryResponseDTO | null;
  type?: GetCategoriesTypeItem;
};

function EditCategory({open, onOpenChange, category, type}: EditCategoryProps) {
  const {t, i18n} = useTranslation();
  const queryClient = useQueryClient();
  const {mutate: updateCategory, isPending} = useUpdateCategory();

  const trPrefix =
    type === GetCategoriesTypeItem.EXPENSE ? 'expense' : 'income';
  const editT = (suffix: string, fallbackSuffix?: string) => {
    const primaryKey = `${trPrefix}.editCategory.${suffix}`;
    if (i18n.exists(primaryKey)) return t(primaryKey);
    return t(`income.editCategory.${fallbackSuffix ?? suffix}`);
  };

  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState<string | null>(category?.icon ?? null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!category?.id) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError(editT('errors.nameRequired'));
      return;
    }
    if (!icon) {
      setError(editT('errors.iconRequired'));
      return;
    }
    setError(null);

    updateCategory(
      {
        categoryId: category.id,
        data: {
          name: trimmed,
          icon,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: getGetCategoriesQueryKey(),
          });
          toast.success(editT('success'));
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const status = isAxiosError(err) ? err.response?.status : undefined;
          if (status === 409) {
            setError(editT('errors.duplicate'));
            return;
          }
          toast.error(editT('errors.updateFailed'));
        },
      },
    );
  };

  if (!category) return null;

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
        className="w-full max-w-[342px] rounded-[10px] border border-white/[0.14] p-5 bg-[var(--glass-bg)] [box-shadow:var(--glass-shadow)] backdrop-blur-[24px] md:max-w-[520px]"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[24px] font-medium leading-[1.167]">
              {editT('title')}
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
              {editT('nameLabel')}
            </label>
            <Input
              placeholder={editT('namePlaceholder')}
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] leading-[1.167] text-muted-foreground">
              {editT('iconLabel')}
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
            {editT('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="h-9 w-[140px]"
          >
            {isPending ? editT('saving') : editT('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategory;
