import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import {useTranslation} from 'react-i18next';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import type {TransactionType} from '@/types/types';

type Props<T extends FieldValues> = {
  // Path<T> гарантує, що ми передаємо ім'я поля, яке існує у формі
  register: UseFormRegister<T>;
  name: Path<T>; 
  error?: string;
  type?: TransactionType;
};

 
export const IncomeAmountField = <T extends FieldValues>({
  register, 
  name,
  error,
  type = 'INCOME'
}: Props<T>) => {
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
        step={0.01}
        type="text"
        inputMode="decimal"
        label={`${t(`incomeModal.fields.amount.${type}`)}*`}
        placeholder="6000"
        error={!!error}
        errorMessage={error}
        className={cn('h-10 sm:h-12 px-3 py-[7.5px]')}
        {...register(name, {
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
