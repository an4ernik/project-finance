import {useTranslation} from 'react-i18next';

function Dashboard() {
  const {t} = useTranslation();
  return <div>{t('dashboard.title')}</div>;
}

export default Dashboard;
