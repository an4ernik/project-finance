import {cn} from '@/lib/utils';

const CreateButtonsWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-[16px] justify-center items-center w-full',
        className,
      )}
    >
      {children}
    </div>
  );
};
export default CreateButtonsWrapper;

// ! ${isManageOpen && 'hidden md:flex'} was in className
