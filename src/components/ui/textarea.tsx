import * as React from 'react';

import {cn} from '@/lib/utils';

function Textarea({className, ...props}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-20 w-full rounded-[10px] border px-3 py-2 text-[16px] leading-[1.167] text-foreground placeholder:text-muted-foreground transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'bg-linear-to-b from-[rgba(144,208,182,0.05)] from-[49%] to-[rgba(49,95,85,0.1)] backdrop-blur-[32px]',
        '[box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] border-[rgba(46,45,45,0.14)] dark:border-white/[0.14]',
        'focus-visible:border-[#02A078] focus-visible:bg-linear-to-b focus-visible:from-[rgba(255,255,255,0.1)] focus-visible:to-[rgba(153,153,153,0.1)]',
        'aria-invalid:border-[#CE0000] aria-invalid:bg-linear-to-b aria-invalid:from-[rgba(199,0,0,0.2)] aria-invalid:to-[rgba(199,0,0,0.3)]',
        className,
      )}
      {...props}
    />
  );
}

export {Textarea};
