import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {useTranslation} from 'react-i18next';

function LangSelect() {
  const {i18n} = useTranslation();
  const normalizedLanguage = i18n.resolvedLanguage ?? i18n.language;
  const currentLang = normalizedLanguage.toLowerCase().startsWith('ua')
    ? 'UA'
    : 'EN';

  const handleLanguage = (value: string) => {
    i18n.changeLanguage(value.toLowerCase());
  };

  return (
    <Select value={currentLang} onValueChange={handleLanguage}>
      <SelectTrigger className="h-12.5 w-20 cursor-pointer px-4 text-[#0b1514] dark:text-[#eaf6f3]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="EN">EN</SelectItem>
        <SelectItem value="UA">UA</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default LangSelect;
