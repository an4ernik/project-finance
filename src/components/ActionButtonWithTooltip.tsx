import React from 'react';
import {cn} from '@/lib/utils';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import type {LucideIcon} from 'lucide-react';

interface ActionButtonWithTooltipProps {
  title: 'edit' | 'archive' | 'delete' | 'restore' | string;
  tooltipText: string;
  icon: LucideIcon;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  theme: {
    deleteIconBg?: string;
    deleteIconText?: string;
    editIconBg?: string;
    editIconText?: string;
  };
  // Optional flag if you want to use the group-hover behavior from your first page
  responsiveHoverHide?: boolean;
}

export const ActionButtonWithTooltip: React.FC<
  ActionButtonWithTooltipProps
> = ({
  title,
  tooltipText,
  icon: Icon,
  onClick,
  className,
  theme,
  responsiveHoverHide = false,
}) => {
  const isDelete = title === 'delete';

  const btnBg = isDelete ? theme.deleteIconBg : theme.editIconBg;
  const btnText = isDelete ? theme.deleteIconText : theme.editIconText;

  return (
    <Tooltip key={title}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation(); // Safe defaults for list items
            onClick(e);
          }}
          className={cn(
            'flex items-center justify-center rounded-lg transition-all cursor-pointer outline-none',
            responsiveHoverHide
              ? 'p-2 animate-in fade-in slide-in-from-right-2 duration-200 [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex'
              : 'size-10 shadow-md', 
            '[@media(hover:none)]:text-[#0B1514] dark:[@media(hover:none)]:text-white',
            btnBg,
            btnText,
            className,
          )}
        >
          <Icon
            className={cn(
              responsiveHoverHide
                ? 'size-4 sm:size-5'
                : 'size-5 transition-colors duration-300',
              !responsiveHoverHide && btnText,
            )}
            strokeWidth={1.5}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={1}
        className="border text-[#3A4A48] dark:text-[#BFD9D2] bg-[#fafafa] fill-[#eef3f2] dark:bg-[#0f453c]"
      >
        <p>{tooltipText.toLocaleLowerCase()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ActionButtonWithTooltip;
