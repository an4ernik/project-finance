import {useTranslation} from 'react-i18next';

function NotificationsSettings() {
  const {t} = useTranslation();

  return (
    <div className="h-full min-h-0 overflow-y-auto px-6 py-6 text-foreground">
      <p className="text-muted-foreground">
        {t('settings.notificationsPlaceholder')}
      </p>
    </div>
  );
}

export default NotificationsSettings;
