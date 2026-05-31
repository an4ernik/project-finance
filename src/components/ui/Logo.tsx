import {useNavigate} from 'react-router-dom';
import {useTheme} from '@/shared/providers/ThemeProvider';
import logo from '@/assets/icons/logo.svg';
import darkLogo from '@/assets/icons/logo-dark.svg';
import smallLogo from '@/assets/icons/small-logo.svg';
import {cn} from '@/lib/utils';

function Logo({className}: {className?: string}) {
  const {theme} = useTheme();
  const navigate = useNavigate();

  const currentFullLogo = theme === 'dark' ? darkLogo : logo;

  return (
    <picture onClick={() => navigate('/')} className="cursor-pointer">
      <source
        media="(min-width: 768px) and (max-width: 1023px)"
        srcSet={smallLogo}
      />

      <img
        src={currentFullLogo}
        alt="Monity"
        className={cn('w-auto shrink-0', className)}
      />
    </picture>
  );
}

export default Logo;
