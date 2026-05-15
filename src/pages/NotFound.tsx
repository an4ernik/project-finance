import AppLayout from '@/layouts/AppLayout';
import cashPig from '../assets/404_dark.png';
import cashPigWhite from '../assets/404_white.png';
import {Button} from '@/components/ui/button';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next'; 
import {useTheme} from '@/shared/providers/ThemeProvider'; 

export default function NotFound() {
  const {theme} = useTheme(); 
  const {t} = useTranslation();

  const currentImage = theme === 'dark' ? cashPig : cashPigWhite;

  return (
    <AppLayout>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="relative w-full max-w-2xl mx-auto aspect-[9/4] overflow-hidden">
          <img
            src={currentImage}
            alt="Pig"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center flex-col gap-5 mt-10">
          <h2 className="text-2xl sm:text-3xl dark:text-[#BFD9D2] text-center">
            {t('notFoundPage.title')}
          </h2>
          <p className="text-xl sm:text-2xl dark:text-[#7F9E97] text-center">
            {t('notFoundPage.description')}
          </p>
          <Link
            className="w-full max-w-[290px]" replace
            to="/dashboard" 
          >
            <Button variant="primary" className="sm:text-xl">
              {t('notFoundPage.button')}
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
