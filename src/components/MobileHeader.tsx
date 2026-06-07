import {Menu} from 'lucide-react';
import SmallLogo from '@/assets/icons/small-logo.svg';
import {useMe} from '@/shared/api/users/useMe';
import type {UserResponseDTO} from '@/shared/api/models';
import defaultAvatar from '@/assets/default-photo.png';
import {cn} from '@/lib/utils';

const MobileHeader = ({className, onClick}: {className?: string, onClick?: () => void}) => {
  const {user} = useMe();
  const userData = user as UserResponseDTO;
  return (
    <header
      className={cn(
        'w-full flex md:hidden items-center justify-between z-30 px-6 py-3.5', 
        'bg-[var(--header-bg)]',
        'dark:bg-[#0b1514]',
        'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]',
        className
      )}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-center size-10 rounded-md border backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
      >
        <Menu className="size-5 text-[#0b1514] dark:text-[#eaf6f3]" />
      </button>
      <img src={SmallLogo} className="h-7 md:h-9.25" />
      <div className="flex md:hidden items-center size-8 rounded-full overflow-hidden">
        <img
          src={userData?.avatarUrl ? userData.avatarUrl : defaultAvatar}
          alt="avatar"
          className="h-full w-full object-cover"
        />
      </div>
    </header>
  );
};
export default MobileHeader;
