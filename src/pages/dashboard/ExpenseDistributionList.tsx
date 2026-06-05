import {formattedAmount} from '@/helpers/helpers'; 
import { useGetCurrencySign } from '@/shared/store/useCurrencySign';

type ExpenseDistributionItem = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};

type ExpenseDistributionListProps = {
  expenseDistributionData: ExpenseDistributionItem[];
};

const ExpenseDistributionList = ({
  expenseDistributionData,
}: ExpenseDistributionListProps) => {
  const CURRENCY_SIGN = useGetCurrencySign();
  
  return (
    <ul className="flex w-full md:max-w-[340px] max-h-[300px] p-1 overflow-y-auto custom-scrollbar flex-col gap-2 flex-1">
      {expenseDistributionData.map(item => (
        <li
          key={item.name}
          className="flex w-full items-center justify-between bg-[#FAFAFA] dark:bg-[#122421] p-1.5 sm:p-2 rounded-lg dark:border dark:border-[#1c3f35]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 text-[12px] text-[#3A4A48] dark:text-[#7F9E97] w-12">
              {item?.value !== 0.01 ? item.percentage : '0'} %
            </span>
            <div
              className="size-4 rounded-sm shrink-0"
              style={{backgroundColor: item.color}}
            />
            <span className="text-[14px] text-[#6F7E7C] dark:text-[#7F9E97] truncate max-w-[170px]">
              {item.name}
            </span>
          </div>
          <span className="shrink-0 text-[14px] text-[#3A4A48] dark:text-[#BFD9D2] font-medium last:text-[#6F7E7C]">
            {item.value === 0.01 ? '0' : formattedAmount(item.value)}{' '}
            {CURRENCY_SIGN}
          </span>
        </li>
      ))}
    </ul>
  );
};
export default ExpenseDistributionList;
