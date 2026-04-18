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
      '[background:radial-gradient(69.44%_69.44%_at_50.72%_30.56%,rgba(255,255,255,0.04)_0%,rgba(153,153,153,0.002)_100%),linear-gradient(180deg,rgba(4,200,158,0.3)_0%,rgba(2,98,77,0.18)_100%)] text-white border-transparent backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:[background:linear-gradient(0deg,rgba(2,160,120,0.3)_0%,rgba(2,160,120,0.5)_50%,rgba(2,160,120,0.8)_100%)] focus-visible:[background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,#04C89E_100%)] disabled:opacity-50 disabled:[background:linear-gradient(180deg,rgba(11,21,20,0.01)_0%,rgba(49,95,85,0.1)_50%,rgba(144,208,182,0.05)_100%)]',

    secondary:
      'text-[#eaf6f3] border-transparent [background:linear-gradient(180deg,rgba(11,21,20,0.01)_0%,rgba(49,95,85,0.1)_50%,rgba(144,208,182,0.05)_100%)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:[background:linear-gradient(0deg,rgba(2,160,120,0.3)_0%,rgba(2,160,120,0.5)_50%,rgba(2,160,120,0.8)_100%)] focus-visible:[background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,#04C89E_100%)] disabled:opacity-50 disabled:[background:linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)]',

    tab: 'text-[#eaf6f3] border-transparent bg-transparent hover:[background:radial-gradient(69.44%_69.44%_at_50.72%_30.56%,rgba(255,255,255,0.04)_0%,rgba(153,153,153,0.002)_100%),linear-gradient(0deg,rgba(2,98,77,0.18)_0%,rgba(4,200,158,0.3)_50%)] hover:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:backdrop-blur-[7px] focus-visible:[background:radial-gradient(69.44%_69.44%_at_50.72%_30.56%,rgba(255,255,255,0.04)_0%,rgba(153,153,153,0.002)_100%)] disabled:opacity-80 disabled:[background:radial-gradient(69.44%_69.44%_at_50.72%_30.56%,rgba(255,255,255,0.04)_0%,rgba(153,153,153,0.002)_100%),linear-gradient(0deg,rgba(11,21,20,0.003)_0%,rgba(49,95,85,0.03)_25%,rgba(144,208,182,0.015)_50%)]',

    ghost:
      'text-[#7f9e97] border-transparent [background:rgba(255,255,255,0.0001)] hover:text-[#eaf6f3] hover:[background:linear-gradient(180deg,rgba(11,21,20,0.0005)_0%,rgba(49,95,85,0.005)_50%,rgba(144,208,182,0.0025)_100%)] hover:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:backdrop-blur-[7px] focus-visible:border-[#02A078] focus-visible:backdrop-blur-[16px] disabled:opacity-50',

    destructive:
      'text-white border-transparent [background:linear-gradient(180deg,rgba(199,0,0,0.2)_0%,rgba(199,0,0,0.3)_100%)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:bg-[#CE0000] focus-visible:bg-[#DC2626] focus-visible:[box-shadow:0px_0px_0px_3px_#FCA5A5] disabled:opacity-50',
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
