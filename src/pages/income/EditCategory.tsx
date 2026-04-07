import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import IconPicker from './IconPicker';
import type {CategoryResponseDTO} from '@/shared/api/models';
import {useTranslation} from 'react-i18next';

type EditCategoryProps = {
  onClose: () => void;
  category: CategoryResponseDTO;
  onSave: (name: string, icon: string) => void;
};

function EditCategory({
  onClose,
  category,
  onSave,
}: EditCategoryProps) {
  const {t} = useTranslation();
  const [name, setName] = useState(category.name ?? '');
  const [icon, setIcon] = useState<string | null>(category.icon ?? null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t('income.editCategory.errors.nameRequired'));
      return;
    }
    if (!icon) {
      setError(t('income.editCategory.errors.iconRequired'));
      return;
    }
    setError(null);
    onSave(trimmed, icon);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-[559px] w-full max-w-[342px] flex-col gap-6 rounded-[10px] bg-card dark:bg-[#142624] p-5 [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] backdrop-blur-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-medium leading-[1.167]">
            {t('income.editCategory.title')}
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
            {t('income.editCategory.nameLabel')}
          </label>
          <Input
            placeholder={t('income.editCategory.namePlaceholder')}
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[16px] leading-[1.167] text-muted-foreground">
            {t('income.editCategory.iconLabel')}
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
            className="[background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)] text-[#e6e6e6] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]"
          >
            {t('income.editCategory.save')}
          </Button>
          <Button
            onClick={onClose}
            className="text-foreground bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] border border-white/30 [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]"
          >
            {t('income.editCategory.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditCategory;
