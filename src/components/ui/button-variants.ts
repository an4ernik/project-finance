import {cn} from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'tab'
  | 'outline'
  | 'default';
export type ButtonSize = 'default' | 'sm' | 'icon';

export interface ButtonVariantsProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const buttonVariants = ({
  variant = 'primary',
  size,
}: ButtonVariantsProps = {}) => {
  const variantClasses = {
    primary:
      '[background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)] text-[#e6e6e6] border-transparent backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:[background:linear-gradient(0deg,rgba(2,160,120,0.3)_0%,rgba(2,160,120,0.5)_50%,rgba(2,160,120,0.8)_100%)] hover:border-transparent focus-visible:ring-[3px] focus-visible:ring-[#02A078]/30',
    secondary:
      'text-[#eaf6f3] border-transparent bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:[background:linear-gradient(0deg,rgba(2,160,120,0.3)_0%,rgba(2,160,120,0.5)_50%,rgba(2,160,120,0.8)_100%)] hover:border-transparent focus-visible:[background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_100%)]',
    ghost:
      'border-transparent bg-transparent text-[#7f9e97] hover:text-[#eaf6f3] hover:bg-linear-to-b hover:from-[rgba(11,21,20,0.01)] hover:via-[rgba(49,95,85,0.1)] hover:to-[rgba(144,208,182,0.05)] hover:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] focus-visible:border focus-visible:border-[#02A078]',
    destructive:
      'border-transparent text-white bg-linear-to-b from-[rgba(199,0,0,0.2)] to-[rgba(199,0,0,0.3)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:bg-[#CE0000] focus-visible:bg-[#DC2626] focus-visible:[box-shadow:0px_0px_0px_3px_rgba(252,165,165,1)]',
    tab:
      'text-[#eaf6f3] border border-white/30 bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] hover:[background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)] hover:border-transparent focus-visible:[background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)]',
    outline:
      'border-white/30 bg-transparent text-[#eaf6f3] hover:bg-white/5 focus-visible:border-[#02A078]',
    default:
      'border-white/65 [background:var(--light-btn-bg-full)] text-[#eaf6f3] backdrop-blur-[5px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.3),0px_10px_26px_0px_rgba(0,0,0,0.2)] dark:[background:linear-gradient(to_bottom,rgba(49,95,85,0.55),rgba(49,95,85,0.18))] dark:backdrop-blur-[7px] dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)] dark:text-foreground hover:opacity-90 active:opacity-80',
  };

  const sizeClasses = {
    default: 'h-12.5 w-full',
    sm: 'h-[34px] px-4',
    icon: 'h-10 w-10',
  };

  return cn(
    'flex items-center justify-center gap-3.5 rounded-[10px] border transition-all duration-200 text-[16px] font-medium leading-[1.167] tracking-[-1.5px] disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    size ? sizeClasses[size] : sizeClasses.default,
  );
};
