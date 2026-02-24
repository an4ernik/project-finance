import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import logo from '@/assets/icons/logo.svg';
import darkLogo from '@/assets/icons/logo-dark.svg';
import {ThemeToggle} from './ThemeToggle';
import {Button} from '@/components/ui/button';
import {useTheme} from '@/shared/providers/ThemeProvider';
import LangSelect from './LangSelect';

function Header() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="absolute top-14 left-12.5 right-12.5 flex items-center justify-between z-10">
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5 p-2.5 shrink-0">
        <img
          src={theme === 'dark' ? darkLogo : logo}
          alt="Monity"
          className="h-9 w-auto"
        />
      </div>

      {/* Center: Nav pill */}
      <div className="flex-1 flex justify-center px-8">
        <nav className="flex h-12.5 items-center gap-10 px-12.5 rounded-[10px] backdrop-blur-lg bg-white/60 dark:bg-transparent border border-[rgba(0,0,0,0.08)] dark:border-transparent [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]">
          {[
            {label: t('landing.nav.about'), id: 'about'},
            {label: t('landing.nav.howItWorks'), id: 'how-it-works'},
            {label: t('landing.nav.security'), id: 'security'},
          ].map(item => (
            <button
              key={item.id}
              onClick={() =>
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({behavior: 'smooth'})
              }
              className="font-light text-[20px] leading-[1.167] text-[#0b1514] dark:text-[#eaf6f3] hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <ThemeToggle></ThemeToggle>
        <LangSelect />

        <Button className="w-57.75" onClick={() => navigate('/login')}>
          {t('auth.confirmed.button')}
        </Button>
      </div>
    </header>
  );
}

export default Header;
