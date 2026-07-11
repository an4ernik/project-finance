import type {LucideIcon} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import Logo from './Logo';
import {CircleQuestionMark, LogOut, X} from 'lucide-react';
import {ThemeToggle} from './ThemeToggle';
import LangSelect from './LangSelect';
import {cn} from '@/lib/utils';
import {NavLink, useNavigate} from 'react-router-dom';
import {useAuthStore} from '@/shared/store/useAuthStore';
import {useQueryClient} from '@tanstack/react-query';

import {SIDEBAR_LINKS} from '@/constances/constances';

type NavItemProps = {
  to: string;
  Icon: LucideIcon;
  label: string;
};

export const NavItem = ({to, Icon, label}: NavItemProps) => {
  const {t} = useTranslation();
  return (
    <NavLink
      to={to}
      className={({isActive}) =>
        `
          flex md:items-center items-start w-full md:w-fit lg:w-full justify-start md:justify-center lg:justify-start gap-[12px]  
          p-3 lg:pl-[16px] lg:py-[10px]
          rounded-[10px]
          text-foreground
          ${
            isActive
              ? 'backdrop-blur-lg bg-white/60 dark:bg-transparent border border-[rgba(0,0,0,0.08)] dark:border-transparent [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }
          `
      }
    >
      <Icon size={20} />
      <span className="sm:block md:hidden lg:block">{t(label)}</span>
    </NavLink>
  );
};

type SideBarProps = {
  variant?: 'desktop' | 'mobile';
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
};

function SideBar({
  variant = 'desktop',
  isOpen = false,
  onClose,
  className,
}: SideBarProps) {
  const {t} = useTranslation();
  const logout = useAuthStore(set => set.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login', {replace: true});
  };

  return (
    <aside
      className={cn(
        'px-[15px] md:px-4 lg:px-[40px]',

        'sm:w-full md:w-[120px] lg:w-[305px] min-h-full flex-col shrink-0 rounded-[10px] transition-all duration-300',
        variant === 'desktop' && 'hidden md:flex',
        variant === 'mobile' &&
          'w-full fixed left-0 top-0 flex h-full -translate-x-full md:hidden z-[100]! pointer-events-none',
        variant === 'mobile' && isOpen && 'translate-x-0 pointer-events-auto',
        'border border-white/[0.14] backdrop-blur-lg',
        'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
        'm:shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
        'md:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]',
        className,
      )}
    >
      {/* Logo container: hide on md, show on lg and sm */}
      <div className="flex items-center justify-evenly px-1 pt-6 lg:px-[24px] lg:pt-[24px]">
        <Logo className="w-full h-[45px] my-[19px] lg:my-[43px] mx-auto" />
        {variant === 'mobile' && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden flex items-center justify-center size-10 rounded-lg border border-white/30 backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
          >
            <X className="size-5 text-[#0b1514] dark:text-[#eaf6f3]" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-hide">
        <ul className="flex flex-col items-start md:items-center lg:items-start px-[70px] md:px-3  space-y-[4px]">
          {SIDEBAR_LINKS.map(link => (
            <NavItem
              key={link.to}
              to={link.to}
              Icon={link.Icon}
              label={link.label}
            />
          ))}
        </ul>

        <div className="pb-[40px] flex flex-col gap-[20px] items-start md:items-center lg:items-start">
          <ul className="space-y-[4px] w-full px-[70px] md:px-0">
            <li className="flex items-center justify-start md:justify-center lg:justify-start gap-[12px] pl-[16px]md:pl-0 lg:pl-[16px] py-[10px] text-muted-foreground">
              <CircleQuestionMark className="shrink-0" />
              <span className="block md:hidden lg:block">
                {t('sidebar.help')}
              </span>
            </li>

            <li
              onClick={handleLogout}
              className="flex items-center justify-start md:justify-center lg:justify-start gap-[12px] pl-[16px] md:pl-0 lg:pl-[16px] py-[10px] cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <LogOut className="shrink-0" />
              <span className="block md:hidden lg:block">
                {t('sidebar.logOut')}
              </span>
            </li>
          </ul>

          <div className="flex flex-row md:flex-col lg:flex-row items-center gap-[16px] px-[60px] md:px-3 lg:px-[30px]">
            <ThemeToggle />
            <LangSelect />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
