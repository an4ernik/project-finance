import {format} from 'date-fns';
import {uk} from 'date-fns/locale';
import {Calendar as CalendarIcon} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {cn} from '@/lib/utils';
import {Label} from '@/components/ui/label';
import DisplayError from '@/components/DisplayError';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Calendar as ComponentCalendar} from '@/components/ui/calendar';
import type {TransactionType} from '@/types/types';

const dateInput = cn(
  'flex items-center gap-2.5 rounded-[10px] border px-2.5 transition-all duration-200',
  '[box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] backdrop-blur-[32px]',
  'bg-linear-to-b from-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
);

type Props = {
  value: Date;
  error?: string;
  onChange: (date: Date) => void;
  disabledDate?: (date: Date) => boolean; 
  type?: TransactionType;
};

export const IncomeDateField = ({
  value,
  error,
  onChange,
  disabledDate, 
  type = 'INCOME',
}: Props) => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-dark-background">
        {t(`incomeModal.fields.date.${type}`)}*
      </Label>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button" 
            className={cn(
              dateInput,
              'h-10 sm:h-12 cursor-pointer gap-1 hover:border-muted-foreground', 
            )}
          >
            <CalendarIcon className="size-5 text-dark-background" />
            <span>{format(value, 'd.MM.yyyy', {locale: uk})}</span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <ComponentCalendar
            required
            disabled={disabledDate}
            mode="single"
            selected={value}
            onSelect={(date: Date) => date && onChange(date)}
          />
        </PopoverContent>
      </Popover>

      <DisplayError errorText={error} />
    </div>
  );
};

export default IncomeDateField;
