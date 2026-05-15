import type {UseFormRegister} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';

type Props = {
  register: UseFormRegister<any>;
  inputValue?: string;
};

// export const IncomeDescriptionField = ({register, inputValue=''}: Props) => {
//   const {t} = useTranslation();

//   return (
//     <div className="flex flex-col gap-2 mb-8 sm:mb-10">
//       <Label className={cn('text-[14px] sm:text-[16px] text-dark-background')}>
//         {t('incomeModal.fields.description')}
//       </Label>

//       <Textarea
//         {...register('description')}
//         className={cn(
//           'h-19 py-3 resize-none data-[placeholder]:text-tertiary] text-[14px]',
//         )}
//         placeholder={t('incomeModal.fields.descriptionPlaceholder')}
//       />
//     </div>
//   );
// };
export const IncomeDescriptionField = ({register, inputValue = ''}: Props) => {
  const {t} = useTranslation();

  const isTooLong = inputValue.length > 256;

  return (
    <div className="flex flex-col gap-2 mb-8 sm:mb-10">
      <Label className="text-[14px] sm:text-[16px] text-dark-background">
        {t('incomeModal.fields.description')}
      </Label>

      <Textarea
        maxLength={256}
        {...register('description')}
        className={cn('h-19 py-3 resize-none text-[14px] custom-scrollbar')}
        placeholder={t('incomeModal.fields.descriptionPlaceholder')}
      />

      <div className="flex justify-between items-center min-h-[20px]">
        {isTooLong ? (
          <p className="text-[12px] text-red-500">
            {t('incomeModal.errors.descriptionMax')}
          </p>
        ) : (
          <div />
        )}

        <span
          className={cn(
            'text-[12px]',
            isTooLong ? 'text-red-500' : 'text-muted-foreground/30',
          )}
        >
          {inputValue.length}/256
        </span>
      </div>
    </div>
  );
};

export default IncomeDescriptionField;
