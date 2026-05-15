import {ArrowDownToLine, Trash2} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import pdfIcon from '../../../assets/pdfIcon.svg';
import DisplayError from '@/components/DisplayError';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';

const fileLabel = cn(
  'text-[#eaf6f3] border-transparent bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:[background:linear-gradient(0deg,rgba(2,160,120,0.3)_0%,rgba(2,160,120,0.5)_50%,rgba(2,160,120,0.8)_100%)] hover:border-transparent focus-visible:[background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_100%)]',
  'min-w-full min-h-12 flex items-center justify-center gap-2 cursor-pointer p-4',
  'cursor-pointer text-dark-background tracking-tight w-full rounded-xl border',
);

type Props = {
  files?: File[];
  error?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (fileName: string) => void;
};

export const IncomeFileField = ({
  files,
  error,
  onChange,
  onRemove,
  disabled,
}: Props) => {
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
      <h2 className="text-xs sm:text-inherit text-dark-background">
        {t('incomeModal.upload.label')}
      </h2>

      <label
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          fileLabel,
          error && 'border border-destructive bg-destructive/10 hover:none!',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input
          type="file"
          multiple
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={onChange}
          disabled={disabled}
        />
        <ArrowDownToLine className="size-4 mb-1 text-dark-background shrink-0" />

        <div className="text-sm truncate">
          {files?.length
            ? files.map(file => file.name).join(', ')
            : t('incomeModal.upload.action')}
        </div>
      </label>

      {files && files.length > 0 && (
        <div className="gap-2 grid grid-cols-3 mt-2">
          {files.map(file => (
            <div
              key={file.name}
              className="relative h-[95px] flex items-center text-xs shadow-sm flex-col rounded-lg overflow-hidden border"
            >
              <img
                className="block w-full h-full object-contain"
                src={URL.createObjectURL(file)}
                alt="Preview"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = pdfIcon;
                }}
              />
              <Button
                variant="destructive"
                aria-label={`${t('incomeModal.cancel')} ${file.name}`}
                type="button"
                onClick={() => onRemove(file.name)}
                className={cn(
                  'absolute w-fit h-fit top-1 right-1 flex items-center gap-2 text-destructive hover:text-white transition-colors cursor-pointer border-none bg-black/0 rounded-sm',
                  'focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 p-1 outline-hidden',
                )}
              >
                <Trash2 className="size-4" />
              </Button>
              <span className="absolute bg-[#02624db2] bottom-0 left-0 p-1.5 truncate w-full text-black dark:text-white">
                {file.name}
              </span>
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
