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
  const currentLang = i18n.language.toLowerCase().startsWith('uk') ? 'UA' : 'EN';

  const handleLanguage = (value: string) => {
    i18n.changeLanguage(value.toLowerCase());
  };

  return (
    <Select onValueChange={handleLanguage} defaultValue={currentLang}>
      <SelectTrigger className="h-12.5 w-20 cursor-pointer rounded-lg border border-[rgba(46,45,45,0.14)] bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] px-4 text-[#0b1514] shadow-none backdrop-blur-lg focus:ring-0 dark:border-white/[0.14] dark:text-[#eaf6f3] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]">
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
