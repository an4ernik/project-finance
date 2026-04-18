import {useEffect, useRef} from 'react';
import {TriangleAlert} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {useTranslation} from 'react-i18next';
import {formattedAmount, getIncomeCategoryById} from '@/helpers/helpers';
import type { ModalProps } from '@/types/types';

const DIALOG_THEMES = {
  income: {
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
  expense: {
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
  type = 'income',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();
  const theme = DIALOG_THEMES[type];
  const category = getIncomeCategoryById(type, item?.categoryId);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const amount = formattedAmount(item.amount) || item.amount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-200"
        onClick={onClose}
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
              {category
                ? t(`incomeModal.categories.${category.val}`)
                : item?.description}
            </span>
            <span className={cn('text-xl font-bold', theme.previewAmount)}>
              {amount} ₴
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

        {item?.isRepeat && item?.isRepeat !== 'once' && (
          <div className="bg-linear-to-b from-[#C7000033] to-[#C700004D] p-3.5 mb-9 rounded-xl border border-[#CE0000] text-sm text-[#0B1514] dark:text-[#BFD9D2] leading-relaxed">
            {t(
              `incomeModal.deleteDialog.${type}.warning.${item.isRepeat as 'monthly' | 'yearly'}`,
            )}
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
            onClick={() => onConfirm(item.id as number)}
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
