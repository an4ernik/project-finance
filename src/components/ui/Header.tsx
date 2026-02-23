import {Link, useNavigate} from 'react-router-dom';
import logo from '@/assets/icons/logo.svg';
import darkLogo from '@/assets/icons/logo-dark.svg';
import {ThemeToggle} from './ThemeToggle';
import {Button} from '@/components/ui/button';
import {useTheme} from '@/shared/providers/ThemeProvider';
import LangSelect from './LangSelect';
import {useTranslation} from 'react-i18next';

function Header() {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <img
              src={theme === 'dark' ? darkLogo : logo}
              alt="logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex items-center gap-8">
            <li>
              <Link
                className="text-sm font-medium transition-colors hover:text-primary"
                to="/signup"
              >
                {t('signUp')}
              </Link>
            </li>
            <li>
              <Link
                className="text-sm font-medium transition-colors hover:text-primary"
                to="/login"
              >
                {t('logIn')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle></ThemeToggle>
          <LangSelect />
          <Button
            variant="default"
            className="hidden md:flex"
            onClick={() => navigate('/login')}
          >
            {t('logIn')}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
