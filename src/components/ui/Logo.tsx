import {useNavigate} from 'react-router-dom';
import {useTheme} from '@/shared/providers/ThemeProvider';
import logo from '@/assets/icons/logo.svg';
import darkLogo from '@/assets/icons/logo-dark.svg';

function Logo({className}: {className?: string}) {
  const {theme} = useTheme();
  const navigate = useNavigate();

  return (
    <img
      src={theme === 'dark' ? darkLogo : logo}
      alt="Monity"
      className={`w-auto cursor-pointer${className ? ` ${className}` : ''}`}
      onClick={() => navigate('/')}
    />
  );
}

export default Logo;
