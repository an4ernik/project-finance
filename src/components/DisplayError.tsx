import {cn} from '@/lib/utils';

const DisplayError = ({
  errorText,
  className,
}: {
  errorText?: string;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        'text-[10px] leading-[1.167] text-destructive min-h-2.75',
        className,
      )}
    >
      {errorText || ''}
    </p>
  );
};
export default DisplayError;
