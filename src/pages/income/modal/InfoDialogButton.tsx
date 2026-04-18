import {cn} from '@/lib/utils';

const optionButtonClasses = cn(
  'flex flex-col items-start shadow shadow-lg gap-1 p-4 w-full rounded-lg  transition-all duration-200 text-left outline-none cursor-pointer',
  'dark:border dark:border-[#1c3f35] bg-linear-to-b from-[#0B151403] via-[#315F551A] to-[#90D0B60D]',
  'focus-visible:ring-2 focus-visible:ring-[#04C89E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08120F]',
);

const onHoverBtn = cn(
  'hover:bg-[#1aedb880]',
  'dark:hover:bg-none dark:hover:bg-linear-to-b dark:hover:from-[#02624D99] dark:hover:to-[#04C89E]',
);

const activeGradient = cn(
  'bg-[#1aedb880] border-[#015E46]',
  'dark:bg-linear-to-b dark:from-[#02624D99] dark:to-[#04C89E] dark:border-[#04C89E]',
);

type RecurringUpdateScope = 'this_only' | 'all_future';

interface InfoDialogButtonProps {
  scope: RecurringUpdateScope;
  selectedScope: RecurringUpdateScope;
  setSelectedScope: (scope: RecurringUpdateScope) => void;
  title: string;
  subtitle: string;
}

const InfoDialogButton = ({
  scope,
  selectedScope,
  setSelectedScope,
  title,
  subtitle,
}: InfoDialogButtonProps) => {
  const isActive = selectedScope === scope;
  return (
    <button
      type="button"
      onClick={() => setSelectedScope(scope)}
      className={cn(
        optionButtonClasses,
        onHoverBtn,
        isActive && activeGradient,
      )}
    >
      <span
        className={cn(
          'font-semibold text-lg transition-colors',
          isActive ? 'text-[#E6E6E6]' : 'text-[#3A4A48 dark:text-[#BFD9D2]',
        )}
      >
        {title}
      </span>
      <span
        className={cn(
          'text-xs transition-colors',
          isActive ? 'text-[#E6E6E6]' : 'text-[#3A4A48] dark:text-[#BFD9D2]',
        )}
      >
        {subtitle}
      </span>
    </button>
  );
};

export default InfoDialogButton;
