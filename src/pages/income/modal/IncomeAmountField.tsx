import type {UseFormRegister, FieldValues, Path} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import type {TransactionType} from '@/types/types';

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: string;
  type?: TransactionType;
};

export const IncomeAmountField = <T extends FieldValues>({
  register,
  name,
  error,
  type = 'INCOME',
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
        placeholder={t(`incomeModal.fields.amount.placeholder`)}
        error={!!error}
        errorMessage={error}
        className={cn('h-10 sm:h-12 py-[7.5px]')}
        {...register(name, {
          onChange: e => {
            let value = e.target.value;
            value = value.replace(/[^0-9.,]/g, '');
            value = value.replace(',', '.');
 
            if (/^0[0-9]+$/.test(value)) {
              if (value.length === 2) {
                // e.g., "01" -> "0.1"
                value = `0.${value[1]}`;
              } else if (value.length === 3) {
                // e.g., "011" -> "0.11"
                value = `0.${value[1]}${value[2]}`;
              } else { 
                value = (parseInt(value, 10) / 100).toString();
              }
            }

            const firstDotIndex = value.indexOf('.');
            if (firstDotIndex !== -1) {
              value =
                value.substring(0, firstDotIndex + 1) +
                value.substring(firstDotIndex + 1).replace(/\./g, '');
            }

            const dotIndex = value.indexOf('.');
            if (dotIndex !== -1) {
              value = value.substring(0, dotIndex + 3);
            }

            e.target.value = value;
          },
        })}
      />
    </div>
  );
};

export default IncomeAmountField;
