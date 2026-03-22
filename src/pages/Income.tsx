import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';

function Income() {
  const {t} = useTranslation();

  return (
    <AppLayout
      title={t('income.title')}
      subtitle={t('income.subtitle')}
      action={
        <div className="flex gap-[36px]">
          <button className="cursor-pointer">Manage categories</button>
          <button className="cursor-pointer">Add Income</button>
        </div>
      }
    ></AppLayout>
  );
}

export default Income;
