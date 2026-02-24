import {useTranslation} from 'react-i18next';
import SideBar from '@/components/ui/SideBar';
import {Outlet} from 'react-router-dom';
import {useMe} from '@/shared/api/users/useMe';
import defaultAvatar from '@/assets/default-photo.png';
import type {UserResponseDTO} from '@/shared/api/models';

function AppLayout() {
  const {t} = useTranslation();
  const {user} = useMe();
  const userData = user as UserResponseDTO;

  return (
    <div className="h-screen flex">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-hidden h-full py-[33.5px] pl-[35px] pr-[50px]">
        <div className="flex flex-row justify-between w-full">
          <div>
            <h2>{t('layout.welcomeBack')}</h2>
            <p>{t('layout.welcomeSubtitle')}</p>
          </div>
          <div className="flex flex-row gap-[4.5px] items-center">
            <img
              src={userData?.avatarUrl ? userData.avatarUrl : defaultAvatar}
              alt="avatar"
              className="h-[29px]"
            />
            <p>{userData.fullName}</p>
          </div>
        </div>
        <main className="mt-[15px] h-full p-[32px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
