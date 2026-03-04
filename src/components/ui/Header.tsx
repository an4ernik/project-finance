import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {ThemeToggle} from './ThemeToggle';
import Logo from './Logo';
import {Button} from '@/components/ui/button';
import LangSelect from './LangSelect';
import {Menu, X} from 'lucide-react';
import {useAuthStore} from '@/shared/store/useAuthStore';

function Header() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuth = useAuthStore(s => s.isAuth);

  const navItems = [
    {label: t('landing.nav.about'), id: 'about'},
    {label: t('landing.nav.howItWorks'), id: 'how-it-works'},
    {label: t('landing.nav.security'), id: 'security'},
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    setMenuOpen(false);
  };

  return (
    <>
      {/* desktop header*/}
      <header className="absolute top-14 left-12.5 right-12.5 hidden md:flex items-center justify-between z-10">
        <Logo className="h-9" />

        <div className="flex-1 flex justify-center px-8">
          <nav className="flex h-12.5 items-center gap-10 px-12.5 rounded-[10px] backdrop-blur-lg bg-white/60 dark:bg-transparent border border-[rgba(0,0,0,0.08)] dark:border-transparent [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="font-light text-[20px] leading-[1.167] cursor-pointer text-[#0b1514] dark:text-[#eaf6f3] hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <LangSelect />
          <Button
            className="w-57.75 cursor-pointer"
            onClick={() => navigate(isAuth ? '/dashboard' : '/login')}
          >
            {isAuth ? t('landing.header.dashboard') : t('auth.confirmed.button')}
          </Button>
        </div>
      </header>

      {/* mobile header  */}
      <header className="absolute top-0 left-0 right-0 flex md:hidden items-center justify-between z-30 px-6 h-16.25 bg-[--light-background] dark:bg-[#0b1514] [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)]">
        <Logo className="h-9.25" />
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center justify-center size-12.5 rounded-xl border border-white/30 backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
        >
          <Menu className="size-5 text-[#0b1514] dark:text-[#eaf6f3]" />
        </button>
      </header>

      {/* mobile burger dropdown */}
      {menuOpen && (
        <>
          {/* backdrop — closes on outside tap */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

          {/* dropdown panel */}
          <div className="fixed top-0 left-0 right-0 z-50 md:hidden rounded-b-[10px] overflow-hidden [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]">
            {/* header row */}
            <div className="flex items-center justify-between px-6 h-16.25 bg-[--light-background] dark:bg-[#0b1514] [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)]">
              <Logo className="h-9.25" />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center size-12.5 rounded-xl border border-white/30 backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
              >
                <X className="size-5.75 text-[#0b1514] dark:text-[#eaf6f3]" />
              </button>
            </div>

            {/* nav items + controls */}
            <div className="flex flex-col items-center gap-5 py-4.5 backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] rounded-b-[10px]">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center justify-center min-h-9 px-4 py-2 rounded-xl font-normal text-[14px] leading-[1.167] text-[#3a4a48] dark:text-[#7f9e97] hover:opacity-80 transition-opacity"
                >
                  {item.label}
                </button>
              ))}

              <div className="flex items-center gap-3 mt-5">
                <ThemeToggle />
                <LangSelect />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Header;
