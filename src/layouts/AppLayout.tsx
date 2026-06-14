import {Outlet, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import SideBar from '@/components/ui/SideBar';
import {useMe} from '@/shared/api/users/useMe';
import defaultAvatar from '@/assets/default-photo.png';
import type {UserResponseDTO} from '@/shared/api/models';
import {useState} from 'react';
import {paths} from '@/constances/constances';
import {cn} from '@/lib/utils';
import MobileHeader from '@/components/MobileHeader';

type AppLayoutProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

function AppLayout({
  title,
  subtitle,
  action,
  children,
  className,
}: AppLayoutProps) {
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
      className={cn(
        ` max-w-[1580px] mx-auto relative flex h-screen bg-background text-foreground scrollbar-hide ${
          menuOpen ? 'overflow-hidden' : 'overflow-y-auto'
        }`,
        className,
      )}
    >
      <MobileHeader
        onClick={() => setMenuOpen(true)}
        className="absolute top-0 left-0 right-0"
      />

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
        className="z-[200]"
      />

      <div className="flex h-auto sm:h-full min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide py-[33.5px] px-[25px] md:pr-[50px] pt-16.25 md:pt-0">
        <div
          className={cn(
            'mt-[35px] w-full',
            // Base/Mobile: Vertical Stack
            'flex flex-col gap-[30px]',
            // MD: Grid (2 rows, 2 columns)
            'md:grid md:grid-cols-2 md:gap-y-4 md:items-center',
            // LG: Single Row Flex
            'xl:flex xl:flex-row xl:justify-between xl:gap-6',
            !isNotExistingRoute && 'xl:justify-end',
          )}
        >
          {/* TITLE SECTION */}
          {isNotExistingRoute && (
            <div className="lg:col-start-1 lg:row-start-1 xl:flex-none">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {resolvedTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {resolvedSubtitle}
              </p>
            </div>
          )}

          {/* AVATAR SECTION */}
          <div
            className={cn(
              'hidden md:flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-self-end lg:order-3',
            )}
          >
            <div className="flex items-center justify-center size-[29px] rounded-full overflow-hidden">
              <img
                src={userData?.avatarUrl || defaultAvatar}
                alt="avatar"
                className="w-full h-full object-cover "
              />
            </div>
            <p className="whitespace-nowrap">
              {userData && userData?.fullName}
            </p>
          </div>

          {/* BUTTONS (ACTION) SECTION */}
          <div
            className={cn(
              !action ? 'hidden' : 'flex',
              // MD: Moves to bottom row, stays right
              'md:col-span-2 md:row-start-2 md:justify-end',
              // LG: In the middle, pushed to right
              'xl:col-span-1 xl:row-start-1 xl:flex-1 xl:order-2 xl:justify-end',
            )}
          >
            {action}
          </div>
        </div>

        <main className="mt-[15px] min-h-0 flex-1 scrollbar-hide">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
