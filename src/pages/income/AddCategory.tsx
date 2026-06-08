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

import {
  getGetCategoriesQueryKey,
  useCreateCategory,
} from '@/shared/api/generated/category-management/category-management';
import {CreateCategoryDTOType} from '@/shared/api/models/createCategoryDTOType';
import {GetCategoriesTypeItem} from '@/shared/api/models/getCategoriesTypeItem';

import IconPicker, {type CategoryIcon} from './IconPicker';

type AddCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: GetCategoriesTypeItem;
};

type ErrorState =
  | {
      name: string | undefined;
      icon: string | undefined;
    }
  | undefined;

function AddCategory({
  open,
  onOpenChange,
  type = GetCategoriesTypeItem.INCOME,
}: AddCategoryProps) {
  const {t, i18n} = useTranslation();
  const queryClient = useQueryClient();
  const {mutate: createCategory, isPending} = useCreateCategory();

  const trPrefix =
    type === GetCategoriesTypeItem.EXPENSE ? 'expense' : 'income';
  const addT = (suffix: string, fallbackSuffix?: string) => {
    const primaryKey = `${trPrefix}.addCategory.${suffix}`;
    if (i18n.exists(primaryKey)) return t(primaryKey);
    return t(`income.addCategory.${fallbackSuffix ?? suffix}`);
  };

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<CategoryIcon | null>(null);
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
    const trimmed = name.trim().slice(0, 25);

    if (!trimmed) {
      setError({...error, name: addT('errors.nameRequired')} as ErrorState);
      return;
    }
    if (!icon) {
      setError({...error, icon: addT('errors.iconRequired')} as ErrorState);
      return;
    }
    setError({name: undefined, icon: undefined});

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
          toast.success(addT('success'));
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const status = isAxiosError(err) ? err.response?.status : undefined;
          if (status === 409) {
            setError({...error, name: addT('errors.duplicate')} as ErrorState);
            return;
          }
          toast.error(addT('errors.createFailed'));
        },
      },
    );
  };

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
        className="w-[calc(100%-40px)] min-w-0 max-h-[90vh] overflow-y-auto sm:w-full rounded-[10px] border border-white/[0.14] p-5 bg-[#FAFAFA] dark:bg-[#142624] [box-shadow:var(--glass-shadow)] backdrop-blur-[24px] scrollbar-hide"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[20px] font-medium leading-[1.167]">
              {addT('title')}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-[16px] leading-[1.167] text-muted-foreground flex items-center justify-between">
              {addT('nameLabel')}
              <span className="text-[12px] text-muted-foreground/40">
                {name.length}/25
              </span>
            </label>
            <Input
              placeholder={addT('namePlaceholder')}
              value={name}
              onChange={handleChangeName}
              error={!!error?.name}
              errorMessage={error?.name}
              className="w-full min-w-0"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] leading-[1.167] text-muted-foreground flex items-center justify-between">
              {addT('iconLabel')}

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
            className="h-9 sm:w-[140px] cursor-pointer shrink cursor-pointer"
            variant="secondary"
          >
            {addT('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="h-9 sm:w-[140px] disabled:cursor-pointer cursor-pointer shrink"
          >
            {isPending ? addT('saving') : addT('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCategory;
