import {useEffect, useRef} from 'react';
import {OctagonMinus} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {useTranslation} from 'react-i18next';
import InfoDialogButton from './InfoDialogButton';
import type {TransactionType} from '@/types/types';

export type RecurringUpdateScope = 'ONLY_THIS' | 'THIS_AND_FUTURE';

type Props = {
  isOpen: boolean;
  onClose: (scope: RecurringUpdateScope | null) => void;
  selectedScope: RecurringUpdateScope;
  setSelectedScope: (scope: RecurringUpdateScope) => void;
  type?: TransactionType;
};

const activeGradient = cn(
  'bg-[#015E4680] dark:bg-[linear-gradient(0deg,rgba(2,98,77,1)_0%,rgba(4,200,158,1)_100%)]',
);

const InfoDialog = ({
  isOpen,
  onClose,
  selectedScope,
  setSelectedScope,
  type = 'INCOME',
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(null);
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay / Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={() => onClose(null)}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className={cn(
          'relative z-10 w-full max-w-[500px] transform overflow-hidden rounded-[26px] p-6 text-left shadow-2xl transition-all',
          'bg-[#EEF3F2] dark:bg-[#142624] border border-[#1c3f35]',
          'animate-in zoom-in-95 fade-in duration-200',
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center size-10 rounded-lg shadow-md border bg-[#e1e1e140] dark:bg-[#315E55]">
            <OctagonMinus className="size-5 dark:text-[#EAF6F3]" />
          </div>
          <h3 className="text-xl font-medium tracking-tight">
            {t('incomeModal.infoDialog.title')}
          </h3>
        </div>

        {/* Description */}
        <p className="text-base text-[#9AA7A5] leading-relaxed mb-6">
          {t(`incomeModal.infoDialog.description.${type}`)}
        </p>

        {/* Options */}
        <div className="space-y-3 mb-8">
          <InfoDialogButton
            scope={'ONLY_THIS'}
            setSelectedScope={setSelectedScope}
            selectedScope={selectedScope}
            title={t(`incomeModal.infoDialog.options.thisOnly.label.${type}`)}
            subtitle={t('incomeModal.infoDialog.options.thisOnly.subtext')}
          />
          <InfoDialogButton
            scope={'THIS_AND_FUTURE'}
            setSelectedScope={setSelectedScope}
            selectedScope={selectedScope}
            title={t(`incomeModal.infoDialog.options.allFuture.label.${type}`)}
            subtitle={t('incomeModal.infoDialog.options.allFuture.subtext')}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onClose(null)}
            className={cn(
              'max-w-30 w-full text-[#0B1514] dark:text-[#EAF6F3] cursor-pointer',
            )}
          >
            {t('incomeModal.infoDialog.actions.cancel')}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => onClose(selectedScope)}
            className={cn('max-w-30 w-full cursor-pointer', activeGradient)}
          >
            {t('incomeModal.infoDialog.actions.apply')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;
