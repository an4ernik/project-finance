import {useEffect, useRef, useState} from 'react';
import {TriangleAlert} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {useTranslation} from 'react-i18next';
import {formattedAmount} from '@/helpers/helpers';
import type {ModalProps} from '@/types/types'; 
import { useGetCurrencySign } from '@/shared/store/useCurrencySign';

const DIALOG_THEMES = {
  INCOME: {
    panel: 'bg-[#EEF3F2] dark:bg-[#142624]',
    iconContainer:
      'flex items-center justify-center bg-linear-to-b from-[#C7000033] to-[#C700004D] dark:bg-linear-to-b dark:from-[#C7000033] dark:to-[#C700004D] border border-gray-200 dark:border-none rounded-[8px]',
    iconColor: 'text-[#CE0000] dark:text-[#CE0000]',
    previewBox:
      'shadow shadow-lg dark:bg-[#1c3f3533] dark:border border-[#015E4620] dark:border-[#1c3f35]',
    previewTitle: 'text-[#3A4A48] dark:text-[#BFD9D2]',
    previewAmount: 'text-[#00AA85]',
    previewSub: 'text-[#6F7E7C] dark:text-[#7F9E97]',
    confirmBtn:
      'bg-[#CE0000] dark:bg-linear-to-t dark:from-[#C7000033] dark:to-[#C700004D] text-white hover:brightness-130',
  },
  EXPENSE: {
    panel: 'bg-[#EEF3F2] dark:bg-[#142624]',
    iconContainer:
      'flex items-center justify-center bg-linear-to-b from-[#C7000033] to-[#C700004D] dark:bg-linear-to-b dark:from-[#C7000033] dark:to-[#C700004D] rounded-[5px]',
    iconColor: 'text-[#CE0000] dark:text-[#CE0000]',
    previewBox:
      'shadow shadow-lg dark:bg-[#1c3f3533] dark:border border-[#015E4620] dark:border-[#1c3f35]',
    previewTitle: 'text-[#3A4A48] dark:text-[#BFD9D2]',
    previewAmount: 'text-[#FF7C02CC] dark:text-[#AA7D00]',
    previewSub: 'text-[#3A4A48] dark:text-[#BFD9D2]',
    confirmBtn:
      'bg-[#CE0000] dark:bg-linear-to-t dark:from-[#C7000033] dark:to-[#C700004D] text-white hover:brightness-120',
  },
};

const RemoveDialog = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  type = 'INCOME',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();
  const CURRENCY_SIGN = useGetCurrencySign();
  const theme = DIALOG_THEMES[type];
  const category = item?.category;
  const [deleteAllFuture, setDeleteAllFuture] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleClose = () => {
    onClose();
    setDeleteAllFuture(false);
  };

  const amount = formattedAmount(item.amount) || item.amount;
  const scope = deleteAllFuture ? 'THIS_AND_FUTURE' : 'ONLY_THIS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className={cn(
          'relative z-10 w-full max-w-[480px] transform overflow-hidden rounded-3xl p-6 text-left shadow-2xl transition-all',
          'animate-in zoom-in-95 fade-in duration-200 border',
          theme.panel,
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={cn(
              'flex items-center justify-center size-10',
              theme.iconContainer,
            )}
          >
            <TriangleAlert className={cn('size-6', theme.iconColor)} />
          </div>
          <h3 className="text-xl font-medium tracking-tight text-[#0B1514] dark:text-[#EAF6F3]">
            {t(`incomeModal.deleteDialog.${type}.title`)}
          </h3>
        </div>

        <p className="text-base text-[#6F7E7C] dark:text-[#BFD9D2] leading-relaxed mb-6">
          {t(`incomeModal.deleteDialog.${type}.description`)}
        </p>

        {/* Item Preview Card */}
        <div
          className={cn(
            'rounded-2xl p-5 mb-4 transition-colors',
            theme.previewBox,
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                'font-semibold text-lg capitalize',
                theme.previewTitle,
              )}
            >
              {category ? category.name : item?.description}
            </span>
            <span className={cn('text-xl font-bold', theme.previewAmount)}>
              {amount} {CURRENCY_SIGN}
            </span>
          </div>
          <div
            className={cn(
              'flex items-center gap-2 text-sm font-medium',
              theme.previewSub,
            )}
          >
            <span>{new Date(item?.date).toLocaleDateString('uk-UA')}</span>
            <span>•</span>
            <span className="truncate">{item?.description}</span>
          </div>
        </div>

        {item?.intervalUnit && item?.intervalUnit !== 'ONCE' && (
          <div className="bg-linear-to-b from-[#C7000033] to-[#C700004D] p-3.5 mb-3 rounded-xl border border-[#CE0000] text-sm text-[#0B1514] dark:text-[#BFD9D2] leading-relaxed">
            {t(
              `incomeModal.deleteDialog.${type}.warning.${item.intervalUnit as 'MONTHLY' | 'YEARLY'}`,
            )}
          </div>
        )}

        {item?.intervalUnit && item?.intervalUnit !== 'ONCE' && (
          <div
            className="flex items-center gap-3 mb-8 p-1 cursor-pointer group w-fit"
            onClick={() => setDeleteAllFuture(!deleteAllFuture)}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={deleteAllFuture}
                onChange={e => setDeleteAllFuture(e.target.checked)}
                className={cn(
                  'peer appearance-none size-6 rounded-lg border transition-all cursor-pointer',
                  'border-[#6F7E7C] dark:border-[#7F9E97] checked:bg-linear-to-b from-[#C7000033] to-[#C700004D] checked:border-[#CE0000]',
                  'hover:border-[#CE0000] dark:hover:border-[#c82e2e] dark:checked:border-[#700808]',
                )}
              />
              {/* Checkmark Icon */}
              <svg
                className="absolute size-4 text-[#0B1514] dark:text-[#BFD9D2] pointer-events-none hidden peer-checked:block transition-opacity"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <label className="text-sm font-medium cursor-pointer select-none text-[#0B1514] dark:text-[#BFD9D2] group-hover:text-[#CE0000] transition-colors">
              {t('incomeModal.deleteDialog.actions.deleteFuture')}
            </label>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-center sm:justify-end gap-10 sm:gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="max-w-30 w-full text-[#0B1514] dark:text-[#EAF6F3] py-2.5 rounded-xl cursor-pointer"
          >
            {t('incomeModal.deleteDialog.actions.cancel')}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => onConfirm(item.id as number, scope)}
            className={cn(
              'max-w-30 w-full py-2.5 rounded-xl cursor-pointer border-none',
              theme.confirmBtn,
            )}
          >
            {t('incomeModal.deleteDialog.actions.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RemoveDialog;
