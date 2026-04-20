import * as React from 'react';

import {cn} from '@/lib/utils';

function Textarea({className, ...props}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-20 w-full rounded-[10px] border px-3 py-2 text-[16px] leading-[1.167] text-foreground placeholder:text-muted-foreground transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'bg-[var(--input-bg-placeholder)] backdrop-blur-[32px]',
        '[box-shadow:var(--glass-shadow)] border-border',
        'focus-visible:border-[#02A078] focus-visible:bg-[var(--input-bg-focus)]',
        'aria-invalid:border-[#CE0000] aria-invalid:bg-linear-to-b aria-invalid:from-[rgba(199,0,0,0.2)] aria-invalid:to-[rgba(199,0,0,0.3)]',
        className,
      )}
      {...props}
    />
  );
}

export {Textarea};
