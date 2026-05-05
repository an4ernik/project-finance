import {cn} from '@/lib/utils';

const ChartWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'w-full h-full min-h-[180px] flex flex-col shadow-lg',
        'border p-2 sm:p-6 rounded-[10px] shadow-lg',
        // Light Mode (Fixed syntax)
        'bg-gradient-to-b from-[#0B151403] via-[#315F551A] to-[#d4f23c0d] text-[#90D0B60D',
        // Dark Mode (Fixed syntax)
        'dark:border-[#1c3f35] dark:bg-gradient-to-b dark:from-[#0B151403] dark:via-[#315F551A] dark:to-[#90D0B60D] dark:text-white',
        className,
      )}
    >
      {children}
    </div>
  );
};
export default ChartWrapper;
