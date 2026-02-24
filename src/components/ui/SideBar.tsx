import {type ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import logo from '@/assets/icons/logo.svg';
import darkLogo from '@/assets/icons/logo-dark.svg';
import {useTheme} from '@/shared/providers/ThemeProvider';
import {
  LayoutGridIcon,
  TrendingUp,
  TrendingDown,
  Cog,
  CircleQuestionMark,
  LogOut,
} from 'lucide-react';
import {ThemeToggle} from './ThemeToggle';
import LangSelect from './LangSelect';
import {cn} from '@/lib/utils';
import {NavLink, useNavigate} from 'react-router-dom';
import {useAuthStore} from '@/shared/store/useAuthStore';
import {useQueryClient} from '@tanstack/react-query';

type NavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
};

export const NavItem = ({to, icon, label}: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({isActive}) =>
        `
          flex items-center gap-[12px]
          pl-[16px] py-[10px]
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
      {icon}
      {label}
    </NavLink>
  );
};

function SideBar() {
  const {theme} = useTheme();
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
        'w-[305px] h-full flex flex-col shrink-0 rounded-[10px]',
        'border border-white/[0.14] backdrop-blur-lg',
        'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
        'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
        '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_0_rgba(0,0,0,0.2)]',
      )}
    >
      <img
        src={theme === 'dark' ? darkLogo : logo}
        alt="logo"
        className="h-[45px] w-auto my-[43px] mx-auto"
      />

      <div className="flex-1 flex flex-col justify-between">
        <ul className="pl-[50px] space-y-[4px] pr-[24px]">
          <NavItem
            to="/dashboard"
            icon={<LayoutGridIcon />}
            label={t('sidebar.dashboard')}
          />

          <NavItem
            to="/income"
            icon={<TrendingUp />}
            label={t('sidebar.income')}
          />

          <NavItem
            to="/expenses"
            icon={<TrendingDown />}
            label={t('sidebar.expenses')}
          />

          <NavItem
            to="/settings"
            icon={<Cog />}
            label={t('sidebar.settings')}
          />
        </ul>

        <div className="pl-[50px] pb-[40px] space-y-[20px]">
          <ul className="space-y-[4px]">
            <li className="flex items-center gap-[12px] pl-[16px] py-[10px] text-muted-foreground">
              <CircleQuestionMark />
              {t('sidebar.help')}
            </li>

            <li
              onClick={handleLogout}
              className="flex items-center gap-[12px] pl-[16px] py-[10px] cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <LogOut />
              {t('sidebar.logOut')}
            </li>
          </ul>

          <div className="flex gap-[16px]">
            <ThemeToggle />
            <LangSelect />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
