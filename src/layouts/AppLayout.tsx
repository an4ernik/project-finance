import {Outlet, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import SideBar from '@/components/ui/SideBar';
import {useMe} from '@/shared/api/users/useMe';
import defaultAvatar from '@/assets/default-photo.png';
import type {UserResponseDTO} from '@/shared/api/models';
import {Menu} from 'lucide-react';
import {Suspense, useState} from 'react';
import SmallLogo from '@/assets/icons/small-logo.svg';
import {PageSkeleton} from '@/components/PageSkeleton';
import {paths} from '@/constances/constances';
import {cn} from '@/lib/utils';

type AppLayoutProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

function AppLayout({title, subtitle, action, children}: AppLayoutProps) {
  const {pathname: location} = useLocation();
  const isNotExistingRoute = paths.includes(location);

  const {t} = useTranslation();
  const {user} = useMe();
  const userData = user as UserResponseDTO;
  const resolvedTitle = title ?? t('settings.welcomeBack');
  const resolvedSubtitle = subtitle ?? t('settings.welcomeSubtitle');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`relative flex h-screen bg-background text-foreground scrollbar-hide ${
        menuOpen ? 'overflow-hidden' : ''
      }`}
    >
      <header className="absolute top-0 left-0 right-0 flex md:hidden items-center justify-between z-30 px-6 h-16.25 bg-[--light-background] dark:bg-[#0b1514] [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)]">
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="flex items-center justify-center size-12.5 rounded-xl border border-white/30 backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
        >
          <Menu className="size-5 text-[#0b1514] dark:text-[#eaf6f3]" />
        </button>
        <img src={SmallLogo} className="h-9.25" />
        <div className="flex md:hidden items-center">
          <img
            src={userData?.avatarUrl ? userData.avatarUrl : defaultAvatar}
            alt="avatar"
            className="h-[29px] rounded-2xl"
          />
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-[2px]"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <SideBar />
      <SideBar
        variant="mobile"
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex h-auto sm:h-full min-h-0 flex-1 flex-col overflow-y-auto custom-scrollbar py-[33.5px] px-[25px] md:pr-[50px] pt-16.25 md:pt-0">
       
        <div
          className={cn(
            'mt-[35px] w-full',
            // Base/Mobile: Vertical Stack
            'flex flex-col gap-[30px]',
            // MD: Grid (2 rows, 2 columns)
            'md:grid md:grid-cols-2 md:gap-y-4 md:items-center',
            // LG: Single Row Flex
            'lg:flex lg:flex-row lg:justify-between lg:gap-6',
          )}
        >
          {/* TITLE SECTION */}
          {isNotExistingRoute && (
            <div className="md:col-start-1 md:row-start-1 lg:flex-none">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {resolvedTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {resolvedSubtitle}
              </p>
            </div>
          )}

          {/* AVATAR SECTION */}
          <div className="hidden md:flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-self-end lg:order-3">
            <img
              src={userData?.avatarUrl || defaultAvatar}
              alt="avatar"
              className="h-[29px] w-[29px] rounded-full object-cover"
            />
            <p className="whitespace-nowrap">
              {userData?.fullName ?? t('layout.userName')}
            </p>
          </div>

          {/* BUTTONS (ACTION) SECTION */}
          <div
            className={cn( 
              !action ? 'hidden' : 'flex',
              // MD: Moves to bottom row, stays right
              'md:col-span-2 md:row-start-2 md:justify-end',
              // LG: In the middle, pushed to right
              'lg:col-span-1 lg:row-start-1 lg:flex-1 lg:order-2 lg:justify-end',
            )}
          >
            {action}
          </div>
        </div>

        <main className="mt-[15px] min-h-0 flex-1 custom-scrollbar">
          <Suspense fallback={<PageSkeleton />}>
            {children ?? <Outlet />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
