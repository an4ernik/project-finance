import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {ThemeToggle} from './ThemeToggle';
import Logo from './Logo';
import {Button} from '@/components/ui/button';
import LangSelect from './LangSelect';
import {Cog, Menu, SquareUserRound, X} from 'lucide-react';
import {useAuthStore} from '@/shared/store/useAuthStore';

function Header() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuth = useAuthStore(s => s.isAuth);
  const navItems = [
    {label: t('landing.nav.about'), id: 'about', icon: SquareUserRound},
    {label: t('landing.nav.howItWorks'), id: 'how-it-works', icon: Menu},
    {label: t('landing.nav.security'), id: 'security', icon: Cog},
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    setMenuOpen(false);
  };

  return (
    <>
      {/* desktop header*/}
      <header className="absolute top-14 right-8 left-8 z-10 hidden items-center justify-between xl:right-12.5 xl:left-12.5 lg:flex">
        <Logo className="h-9" />

        <div className="flex flex-1 justify-center px-5 xl:px-8">
          <nav className="flex h-12.5 items-center gap-5 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white/60 px-7 backdrop-blur-lg [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] dark:border-transparent dark:bg-transparent xl:gap-10 xl:px-12.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="cursor-pointer whitespace-nowrap text-[18px] leading-[1.167] font-light text-[#0b1514] transition-opacity hover:opacity-80 dark:text-[#eaf6f3] xl:text-[20px]"
              >
                <span className="hidden lg:inline">{item.label}</span>
                <item.icon className="size-6 lg:hidden" />
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <LangSelect />
          <Button
            className="w-36 cursor-pointer xl:w-57.75"
            onClick={() => navigate(isAuth ? '/dashboard' : '/login')}
          >
            {isAuth
              ? t('landing.header.dashboard')
              : t('auth.confirmed.button')}
          </Button>
        </div>
      </header>

      {/* mobile header  */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-16.25 items-center justify-between bg-[--light-background] px-6 [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] dark:bg-[#0b1514] lg:hidden">
        <Logo className="h-9.25" />
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center justify-center size-12.5 rounded-xl border border-white/30 backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
        >
          <Menu className="size-5 text-[#0b1514] dark:text-[#eaf6f3]" />
        </button>
      </header>

      {/* mobile/tablet burger dropdown */}
      {menuOpen && (
        <>
          {/* backdrop — closes on outside tap */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />

          {/* dropdown panel */}
          <div className="fixed top-0 right-0 left-0 z-50 overflow-hidden rounded-b-[10px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] lg:hidden">
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
