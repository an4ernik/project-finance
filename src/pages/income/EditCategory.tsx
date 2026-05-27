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

type ErrorState =
  | {
      name: string | undefined;
      icon: string | undefined;
    }
  | undefined;

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
  const [error, setError] = useState<ErrorState>({
    name: undefined,
    icon: undefined,
  });

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 25) {
      setName(event.target.value);
      setError(undefined);
    }
  };

  const handleSave = () => {
    const id = category?.id;
    if(id === undefined) return;
    
    const trimmed = name.trim().slice(0, 25);

    if (!trimmed) {
      setError({...error, name: editT('errors.nameRequired')} as ErrorState);
      return;
    }
    if (!icon) {
      setError({...error, icon: editT('errors.iconRequired')} as ErrorState);
      return;
    }
    setError({name: undefined, icon: undefined});

    updateCategory(
      {
        categoryId: id,
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
            setError({...error, name: editT('errors.duplicate')} as ErrorState);
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
        if (!next) setError(undefined);
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-32px)] sm:w-full max-w-[440px] rounded-[10px] border border-white/[0.14] p-5 bg-[#FAFAFA] dark:bg-[#142624] [box-shadow:var(--glass-shadow)] backdrop-blur-[24px] md:max-w-[520px]"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[20px] font-medium leading-[1.167]">
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
            <label className="text-[16px] leading-[1.167] text-muted-foreground flex items-center justify-between">
              {editT('nameLabel')}
              <span className="text-[12px] text-muted-foreground/40">
                {name.length}/25
              </span>
            </label>
            <Input
              placeholder={editT('namePlaceholder')}
              value={name}
              onChange={handleChangeName}
              error={!!error?.name}
              errorMessage={error?.name}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] leading-[1.167] text-muted-foreground flex items-center justify-between">
              {editT('iconLabel')}

              {!icon && (
                <p className="text-[10px] leading-[1.167] text-destructive">
                  {error?.icon}
                </p>
              )}
            </label>
            <IconPicker
              value={icon}
              onChange={setIcon}
              columns={5}
              buttonClassName="size-11 rounded-[10px]"
              iconClassName="size-5"
            />
          </div>
        </div>

        <DialogFooter className="mt-2 flex-row justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 max-w-[140px]"
            variant="secondary"
          >
            {editT('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="h-9 max-w-[140px]"
          >
            {isPending ? editT('saving') : editT('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategory;
