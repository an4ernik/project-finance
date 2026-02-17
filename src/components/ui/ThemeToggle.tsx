import { useTheme } from '@/shared/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-accent transition-colors"
    >
      {theme === 'light' ? (
        <Moon className="size-5 text-slate-900" />
      ) : (
        <Sun className="size-5 text-yellow-400" />
      )}
    </button>
  );
};