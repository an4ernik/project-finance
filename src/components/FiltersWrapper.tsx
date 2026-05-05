import {cn} from '@/lib/utils';

const FiltersWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'w-full h-auto rounded-[16px] p-6 bg-secondary flex flex-col gap-2',
        className,
      )}
    >
      {children}
    </div>
  );
};
export default FiltersWrapper;
