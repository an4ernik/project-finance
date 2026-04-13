import type {UseFormRegister} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';

type Props = {
  register: UseFormRegister<any>;
  error?: string;
};

export const IncomeAmountField = ({register, error}: Props) => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Input
        onKeyDown={e => {
          if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        min={0}
        type="text"
        inputMode="decimal"
        label={`${t('incomeModal.amount')}*`}
        placeholder="6000"
        error={!!error}
        errorMessage={error}
        className={cn('h-10 sm:h-12 px-3 py-[7.5px]')}
        {...register('amount', {
          onChange: e => {
            const value = e.target.value;
            const cleanedValue = value
              .replace(/[^0-9.]/g, '')
              .replace(/(\..*)\./g, '$1');
            e.target.value = cleanedValue;
          },
        })}
      />
    </div>
  );
};

export default IncomeAmountField;
