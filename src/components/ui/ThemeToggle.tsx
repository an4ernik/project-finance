import {useTheme} from '@/shared/providers/ThemeProvider';
import {Sun, Moon} from 'lucide-react';

export const ThemeToggle = () => {
  const {theme, toggleTheme} = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex justify-center cursor-pointer items-center w-12.5 h-12.5 p-2 rounded-lg backdrop-blur-lg bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] border border-[rgba(46,45,45,0.14)] dark:border-white/[0.14] text-[#0b1514] dark:text-[#eaf6f3] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
    >
      {theme === 'light' ? (
        <Moon className="size-5 text-slate-900" />
      ) : (
        <Sun className="size-5" />
      )}
    </button>
  );
};
