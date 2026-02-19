import * as React from 'react';
import {cn} from '@/lib/utils';
import type {ButtonVariant, ButtonSize} from './button-variants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size,
      isLoading,
      icon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      primary: cn(
        // light
        'border-white/65 [background:var(--light-btn-bg-full)] text-[#eaf6f3]',
        'backdrop-blur-[5px]',
        '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.3),0px_10px_26px_0px_rgba(0,0,0,0.2)]',
        // dark
        'dark:[background:linear-gradient(to_bottom,rgba(49,95,85,0.55),rgba(49,95,85,0.18))]',
        'dark:backdrop-blur-[7px]',
        'dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]',
        'dark:text-foreground',
        'hover:opacity-90 active:opacity-80',
      ),
      secondary: cn(
        'border-transparent bg-transparent',
        'text-[var(--light-btn-bg)]',
        'dark:text-primary',
        'hover:opacity-80 active:opacity-70',
      ),
      default: cn(
        // light
        'border-white/65 [background:var(--light-btn-bg-full)] text-[#eaf6f3]',
        'backdrop-blur-[5px]',
        '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.3),0px_10px_26px_0px_rgba(0,0,0,0.2)]',
        // dark
        'dark:[background:linear-gradient(to_bottom,rgba(49,95,85,0.55),rgba(49,95,85,0.18))]',
        'dark:backdrop-blur-[7px]',
        'dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]',
        'dark:text-foreground',
        'hover:opacity-90 active:opacity-80',
      ),
      outline: cn(
        'border-[var(--light-btn-bg)] bg-transparent text-[var(--light-btn-bg)]',
        'dark:border-white/[0.14] dark:text-foreground',
        'hover:opacity-90',
        'dark:hover:border-white/65 dark:hover:bg-white/5',
      ),
      ghost: cn(
        'border-transparent bg-transparent text-foreground',
        'hover:bg-[var(--light-btn-bg)]/10',
        'dark:hover:bg-white/5',
      ),
    };

    const sizeClasses = {
      default: 'h-12.5 w-full',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'flex items-center justify-center gap-3.5 rounded-[10px] border transition-all duration-200',
          'text-[16px] font-medium leading-[1.167] tracking-[-1.5px]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          size ? sizeClasses[size] : sizeClasses.default,
          className,
        )}
        {...props}
      >
        {children}
        {icon && <div className="shrink-0">{icon}</div>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export {Button};
