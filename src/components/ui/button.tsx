import * as React from 'react';
import {cn} from '@/lib/utils';
import type {ButtonSize, ButtonVariant} from './button-variants';
import {buttonVariants} from './button-variants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      size,
      variant,
      isLoading,
      icon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({variant, size}),
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
