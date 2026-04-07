import {useState} from 'react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import IconPicker from './IconPicker';
import {
  getGetCategoriesQueryKey,
  useCreateCategory,
} from '@/shared/api/generated/category-management/category-management';
import {useQueryClient} from '@tanstack/react-query';
import {CreateCategoryDTOType} from '@/shared/api/models/createCategoryDTOType';
import {GetCategoriesTypeItem} from '@/shared/api/models/getCategoriesTypeItem';
import {useTranslation} from 'react-i18next';

type AddCategoryProps = {
  onClose: () => void;
  type?: GetCategoriesTypeItem;
};

function AddCategory({
  onClose,
  type = GetCategoriesTypeItem.INCOME,
}: AddCategoryProps) {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const {mutate: createCategory, isPending} = useCreateCategory();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetCategoriesQueryKey({
              name: '',
              type: [type],
            }),
          });
          toast.success(t('income.addCategory.success'));
          onClose();
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
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-[559px] w-full max-w-[342px] flex-col gap-6 rounded-[10px] bg-card dark:bg-[#142624] p-5 [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] backdrop-blur-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-medium leading-[1.167]">
            {t('income.addCategory.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            ✕
          </button>
        </div>

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

        <div className="mt-auto flex flex-col gap-4">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="[background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)] text-[#e6e6e6] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]"
          >
            {isPending
              ? t('income.addCategory.saving')
              : t('income.addCategory.save')}
          </Button>
          <Button
            onClick={onClose}
            className="text-foreground bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] border border-white/30 [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]"
          >
            {t('income.addCategory.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
