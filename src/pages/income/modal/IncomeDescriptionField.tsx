import type {UseFormRegister} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';

type Props = {
  register: UseFormRegister<any>;
};

export const IncomeDescriptionField = ({register}: Props) => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col gap-2 mb-8 sm:mb-10">
      <Label className={cn('text-[14px] sm:text-[16px] text-dark-background')}>
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
  );
};

export default IncomeDescriptionField;