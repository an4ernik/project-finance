import type {LucideIcon} from 'lucide-react';
import {
  TrendingUp,
  Award,
  DollarSign,
  Gift,
  Dock,
  BriefcaseBusiness,
  Coins,
  Wallet,
  Percent,
  Trophy,
  Receipt,
  MonitorCheck,
  Globe,
  DatabaseBackup,
} from 'lucide-react';
import {cn} from '@/lib/utils';

export type IconOption = {
  id: string;
  Icon: LucideIcon;
};

export const ICON_OPTIONS: IconOption[] = [
  {id: 'trend_up', Icon: TrendingUp},
  {id: 'award', Icon: Award},
  {id: 'dollar', Icon: DollarSign},
  {id: 'gift', Icon: Gift},
  {id: 'dock', Icon: Dock},
  {id: 'briefcase', Icon: BriefcaseBusiness},
  {id: 'coins', Icon: Coins},
  {id: 'wallet', Icon: Wallet},
  {id: 'percent', Icon: Percent},
  {id: 'trophy', Icon: Trophy},
  {id: 'receipt', Icon: Receipt},
  {id: 'monitor', Icon: MonitorCheck},
  {id: 'globe', Icon: Globe},
  {id: 'database', Icon: DatabaseBackup},
];

export const ICONS_BY_ID = ICON_OPTIONS.reduce<Record<string, LucideIcon>>(
  (acc, item) => {
    acc[item.id] = item.Icon;
    return acc;
  },
  {},
);

type IconPickerProps = {
  value: string | null;
  onChange: (id: string) => void;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  columns?: number;
};

function IconPicker({
  value,
  onChange,
  className,
  buttonClassName,
  iconClassName,
  columns = 7,
}: IconPickerProps) {
  const columnsClass =
    {
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
    }[columns] ?? 'grid-cols-7';

  return (
    <div
      role="radiogroup"
      className={cn(
        'grid gap-3',
        columnsClass,
        className,
        'md:flex md:justify-between md:gap-[20px] md:flex-wrap',
      )}
    >
      {ICON_OPTIONS.map(({id, Icon}) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(id)}
            className={cn(
              'flex size-12 items-center justify-center rounded-xl border transition-colors',
              isActive
                ? 'border-emerald-400 bg-emerald-500/20'
                : 'border-white/30 bg-white/5 hover:bg-white/10',
              buttonClassName,
            )}
          >
            <Icon className={cn('size-6 text-foreground', iconClassName)} />
          </button>
        );
      })}
    </div>
  );
}

export default IconPicker;
