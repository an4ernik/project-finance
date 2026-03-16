import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';

function Dashboard() {
  const {t} = useTranslation();
  return (
    <AppLayout title={t('dashboard.title')}>
      <div>
        <p>Welcome</p>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
