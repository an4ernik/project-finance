// import {useTranslation} from 'react-i18next';
import {NavLink, Outlet} from 'react-router-dom';
import {User, Shield, Bell} from 'lucide-react';

function SettingsPage() {
  const activeStyle =
    'backdrop-blur-lg bg-white/60 rounded-[10px] dark:bg-transparent border border-[rgba(0,0,0,0.08)] dark:border-transparent [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]';

  const normalStyle =
    'text-muted-foreground hover:text-foreground transition-all';

  return (
    <div className="flex flex-col gap-6 bg-background">
      <div className="flex flex-row border-b border-white/10 bg-card rounded-[10px]">
        <NavLink
          to="/settings"
          end
          className={({isActive}) =>
            `flex items-center gap-2 px-6 py-3 ${isActive ? activeStyle : normalStyle}`
          }
        >
          <User size={18} />
          <span>Аккаунт</span>
        </NavLink>

        <NavLink
          to="/settings/security"
          className={({isActive}) =>
            `flex items-center gap-2 px-6 py-3 ${isActive ? activeStyle : normalStyle}`
          }
        >
          <Shield size={18} />
          <span>Безпека</span>
        </NavLink>

        <NavLink
          to="/settings/notifications"
          className={({isActive}) =>
            `flex items-center gap-2 px-6 py-3 ${isActive ? activeStyle : normalStyle}`
          }
        >
          <Bell size={18} />
          <span>Сповіщення</span>
        </NavLink>
      </div>

      <div className="mt-4 bg-card h-100 rounded-[10px]">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsPage;
