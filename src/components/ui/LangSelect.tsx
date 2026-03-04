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

  const handleLanguage = (value: string) => {
    i18n.changeLanguage(value.toLowerCase());
  };

  return (
    <Select
      onValueChange={handleLanguage}
      defaultValue={i18n.language.toUpperCase()}
    >
      <SelectTrigger className="w-17.5 border-none shadow-none focus:ring-0 cursor-pointer">
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
