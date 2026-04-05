import * as React from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {cn} from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  variant?: 'text' | 'password';
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      icon,
      error,
      errorMessage,
      label,
      variant = 'text',
      type,
      onChange,
      value,
      defaultValue,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = variant === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const [internalValue, setInternalValue] = React.useState(
      (value ?? defaultValue ?? '') as string | number,
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string | number);
      }
    }, [value]);

    const hasValue = String(internalValue ?? '').length > 0;
    const isDisabled = disabled || false;

    return (
      <div className="flex w-full flex-col items-start gap-1.5">
        {label && (
          <label className="text-[16px] leading-[1.167] text-dark-background">
            {label}
          </label>
        )}
        <div className="flex w-full flex-col gap-1.25 h-fit">
          <div
            className={cn(
              'flex h-10 items-center gap-2.5 rounded-[10px] border px-2.5 transition-all duration-200',
              '[box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] backdrop-blur-[32px]',
              hasValue
                ? 'bg-linear-to-b from-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]'
                : 'bg-linear-to-b from-[rgba(144,208,182,0.05)] from-[49%] to-[rgba(49,95,85,0.1)]',
              !error &&
                !isDisabled &&
                'hover:border-muted-foreground focus-within:border-[#02A078] focus-within:bg-linear-to-b focus-within:from-[rgba(255,255,255,0.1)] focus-within:to-[rgba(153,153,153,0.1)]',
              error &&
                'border-[#CE0000] border-[0.5px] bg-linear-to-b from-[rgba(199,0,0,0.2)] to-[rgba(199,0,0,0.3)]',
              isDisabled &&
                'border-[#5A736E] bg-[rgba(153,153,153,0.1)] opacity-50',
            )}
          >
            {icon && (
              <div className="shrink-0 text-muted-foreground">{icon}</div>
            )}
            <input
              ref={ref}
              type={inputType}
              className={cn(
                'h-full w-full flex-1 bg-transparent text-[16px] leading-[1.167] text-foreground placeholder:text-muted-foreground',
                'border-0 p-0 outline-none ring-0 focus:outline-none focus:ring-0',
              )}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              onChange={event => {
                setInternalValue(event.target.value);
                onChange?.(event);
              }}
              {...props}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeOff className="size-5" />
                )}
              </button>
            )}
          </div>
          {/* {errorMessage && ( */}
          <p className="text-[10px] leading-[1.167] text-destructive min-h-3">
            {errorMessage || ''}
          </p>
          {/* )} */}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export {Input};
