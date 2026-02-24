import {useTranslation} from 'react-i18next';

function SecuritySettings() {
  const {t} = useTranslation();

  return (
    <div className="rounded-[10px] border border-border bg-card px-6 py-4 text-foreground">
      <p className="text-muted-foreground">Ліза прівєт</p>
    </div>
  );
}

export default SecuritySettings;
