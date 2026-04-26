
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PERIOD_OPTIONS } from '@/helpers/helpers';
import {cn} from '@/lib/utils';
import type { StatisticsByDateProps } from '@/types/types';
 
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
 
function StatisticsByDate({value, onChange}: StatisticsByDateProps) {
  const {t} = useTranslation();
  return (   
    <Select value={value} onValueChange={onChange} defaultValue="week">
      <SelectTrigger
        className={cn(
          // Hides the shadcn default chevron to use our custom one inside the div
          '[&>svg]:hidden',
          'h-10 sms:w-full max-w-46 sm:px-4 rounded-[8px]',
          'bg-transparent border border-[#dadddd] dark:border-[#434e4b]',
          'text-[#0B1514] dark:text-[#A9C1BB] font-medium outline-none',
          'hover:bg-[#0B151403] dark:hover:bg-[#17302c] transition-all',
        )}
      >
        <div className="flex items-center justify-center w-full gap-2 text-[14px]">
          <div className="flex items-center gap-2.5">
            <SelectValue placeholder="Period" />
          </div>
          <ChevronDown className="size-5" />
        </div>
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={6}
        className={cn(
          '[&_span:has(svg)]:hidden',
          'w-full max-w-[180px] rounded-[16px] shadow-xl p-1',
          'bg-[#EEF3F2] dark:bg-[#122421] border-[#dadddd] dark:border-[#434e4b]',
        )}
      >
        <SelectGroup className="flex flex-col gap-1">
          {PERIOD_OPTIONS.map(item => (
            <SelectItem
              key={item.val}
              value={item.val} 
              className={cn(
                'relative flex w-full justify-center cursor-pointer select-none items-center rounded-[12px] px-4 py-2.5 text-sm outline-none transition-all',
                'text-[#7F9E97] hover:bg-[#0B151403] dark:hover:bg-[#17302c]',

                // Active States
                'data-[state=checked]:text-[#0B1514] dark:data-[state=checked]:text-[#EAF6F3]',
                'data-[state=checked]:border dark:data-[state=checked]:border-[#4B6560]',
                'data-[state=checked]:dark:bg-[linear-gradient(180deg,rgba(27,52,47,0.95)_0%,rgba(19,37,34,0.98)_100%)]',
                'data-[state=checked]:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(125,164,154,0.08),0_10px_24px_rgba(0,0,0,0.2)]',
              )}
            >
              <div className="flex items-center gap-3">
                <item.Icon className="hidden sm:block sm:size-4 shrink-0" />
                <span className="capitalize">{t(`dashboard.periods.${item.val}`)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default StatisticsByDate;
