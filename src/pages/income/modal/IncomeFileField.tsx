import {ArrowDownToLine, X} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {Label} from '@/components/ui/label';
import DisplayError from '@/components/DisplayError';
import {cn} from '@/lib/utils';

const fileLabel = cn(
  'text-[#eaf6f3] border-transparent bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:[background:linear-gradient(0deg,rgba(2,160,120,0.3)_0%,rgba(2,160,120,0.5)_50%,rgba(2,160,120,0.8)_100%)] hover:border-transparent focus-visible:[background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_100%)]',
  'min-w-full min-h-12 flex items-center justify-center gap-2 cursor-pointer p-4',
  'cursor-pointer text-dark-background tracking-tight w-full rounded-xl border',
);

type Props = {
  files?: File[];
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (fileName: string) => void;
};

export const IncomeFileField = ({files, error, onChange, onRemove}: Props) => {
  const {t} = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const input = e.currentTarget.querySelector('input');
      input?.click();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs sm:text-inherit text-dark-background">
        {t('incomeModal.upload.label')}
      </Label>

      <label
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          fileLabel,
          error && 'border border-destructive bg-destructive/10 hover:none!',
        )}
      >
        <input
          type="file"
          multiple
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={onChange}
        />
        <ArrowDownToLine className="size-4 mb-1 text-dark-background shrink-0" />

        <div className="text-sm truncate">
          {files?.length
            ? files.map(file => file.name).join(', ')
            : t('incomeModal.upload.action')}
        </div>
      </label>

      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map(file => (
            <div
              key={file.name}
              className="flex items-center text-xs shadow-sm flex-wrap"
            >
              <button
                aria-label={`${t('incomeModal.cancel')} ${file.name}`}
                type="button"
                onClick={() => onRemove(file.name)}
                className={cn(
                  'flex items-center gap-2 text-destructive hover:text-red-700 transition-colors cursor-pointer border-none bg-black/0 px-2 py-1 rounded-full',
                  'focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 outline-hidden',
                )}
              >
                <span className="truncate max-w-[150px] text-black dark:text-white">
                  {file.name}
                </span>
                <X className="size-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <DisplayError
        errorText={error ? error : t('incomeModal.upload.hint')}
        className={cn(error ? 'text-destructive' : 'text-[#6F7E7C]')}
      />
    </div>
  );
};

export default IncomeFileField;
