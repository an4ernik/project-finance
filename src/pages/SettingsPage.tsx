import {useTranslation} from 'react-i18next';
import {NavLink, Outlet} from 'react-router-dom';
import {User, Shield, Bell} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

function SettingsPage() {
  const {t} = useTranslation();
  const activeStyle =
    'backdrop-blur-lg bg-white/60 rounded-[10px] dark:bg-transparent border border-[rgba(0,0,0,0.08)] dark:border-transparent [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]';

  const normalStyle =
    'text-muted-foreground hover:text-foreground transition-all';

  return (
    <AppLayout
      title={t('settings.welcomeBack')}
      subtitle={t('settings.welcomeSubtitle')}
    >
      <div className="flex h-full min-h-0 min-w-0 flex-col gap-4 bg-background text-foreground">
        <div className="flex flex-wrap gap-2 rounded-[10px] border border-border bg-card sm:flex-nowrap sm:gap-[50px] sm:min-h-[63.5px]">
          <NavLink
            to="/settings"
            end
            className={({isActive}) =>
              `flex min-h-[48px] flex-1 items-center justify-center gap-2 px-4 py-3 flex-col sm:flex-row sm:flex-none sm:max-w-[150px] ${isActive ? activeStyle : normalStyle}`
            }
          >
            <User size={18} className="shrink-0" />
            <span>{t('settings.tabs.account')}</span>
          </NavLink>

          <NavLink
            to="/settings/security"
            className={({isActive}) =>
              `flex min-h-[48px] flex-1 items-center justify-center gap-2 px-4 py-3 flex-col sm:flex-row sm:flex-none sm:max-w-[150px] ${isActive ? activeStyle : normalStyle}`
            }
          >
            <Shield size={18} className="shrink-0" />
            <span>{t('settings.tabs.security')}</span>
          </NavLink>

          <NavLink
            to="/settings/notifications"
            className={({isActive}) =>
              `flex min-h-[48px] flex-1 items-center justify-center gap-2 px-4 py-3 flex-col sm:flex-row sm:flex-none sm:max-w-[150px] ${isActive ? activeStyle : normalStyle}`
            }
          >
            <Bell size={18} className="shrink-0" />
            <span>{t('settings.tabs.notifications')}</span>
          </NavLink>
        </div>

        <div className="min-h-0 flex-1 rounded-[10px] border border-border bg-card overflow-hidden">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}

export default SettingsPage;
