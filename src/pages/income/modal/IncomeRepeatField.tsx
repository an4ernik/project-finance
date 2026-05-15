import {useTranslation} from 'react-i18next';

import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';    
import {cn} from '@/lib/utils';

const btnRepeatActive = cn(
  'bg-[#015E4680] text-white font-medium',
  'dark:bg-[linear-gradient(0deg,#02624D_0%,#04C89E_100%)] dark:border-[#02624D]',
  'shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),0px_4px_10px_rgba(0,0,0,0.3)]',
);

const REPEAT_INCOME_TYPES = ['ONCE', 'MONTHLY', 'YEARLY'] as const;

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export const IncomeRepeatField = ({value, onChange}: Props) => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col gap-2 mb-7 sm:mb-[15px]">
      <Label className="text-[14px] sm:text-[16px] text-dark-background">
        {t('incomeModal.repeat.label')}
      </Label>

      <div className="grid grid-cols-3 gap-3">
        {REPEAT_INCOME_TYPES.map(type => (
          <Button
            variant="secondary"
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'h-[47px] sm:h-[52px] tracking-tight text-dark-background cursor-pointer text-[12px] sm:text-[14px]',
              value === type && btnRepeatActive,
            )}
          > 
            {t(`incomeModal.repeat.${type}`)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default IncomeRepeatField;