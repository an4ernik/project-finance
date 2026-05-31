import {FileText, Pencil, Trash} from 'lucide-react';
import {format} from 'date-fns';
import {useTranslation} from 'react-i18next';
import {cn} from '@/lib/utils';
import {formattedAmount} from '@/helpers/helpers';
import {type VirtualItemProps} from '@/types/types';
import {ICONS_BY_ID} from '@/pages/income/IconPicker';
import DocumentModal from './DocumentModal';
import {useState} from 'react';
import {useGetCurrencySign} from '@/shared/store/useCurrencySign';
import {TRANSACTION_THEMES} from '@/constances/constances';
export const VirtualItem = ({
  item,
  type = 'INCOME',
  onEdit,
  onDelete,
}: VirtualItemProps) => {
  const {t} = useTranslation();
  const CURRENCY_SIGN = useGetCurrencySign();
  const theme = TRANSACTION_THEMES[type];
  const dbItem = item.category;
  const category = item.type ?? dbItem.type ?? type;
  const itemAmount = formattedAmount(item.amount);
  const Icon = ICONS_BY_ID[dbItem.icon];

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item?.receiptsUrls?.length) {
      setIsDocumentModalOpen(true);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 🌟 ВАРІАНТ 1 — ПОКАЗУЄТЬСЯ ТІЛЬКИ НА LG І БІЛЬШИХ ЕКРАНАХ (lg:flex) */}
      {/* ========================================================================= */}
      <div
        onClick={handleContainerClick}
        className={cn(
          'hidden lg:flex', // 🌟 Поза межами lg цей блок повністю прихований
          'group relative min-h-[112px] items-center rounded-xl p-5 gap-4 tracking-wider cursor-pointer w-full',
          'bg-white dark:bg-[#193432] border border-slate-100 dark:border-none text-slate-900 dark:text-white',
          'bg-linear-to-b from-transparent to-transparent',
          theme.container,
        )}
      >
        {/* ICON BOX */}
        <div
          className={cn(
            'size-10 hidden sm:flex justify-center items-center p-3 rounded-lg shrink-0',
            theme.bgIcon,
          )}
        >
          {Icon && (
            <Icon className={cn('size-5 transition-colors', theme.textIcon)} />
          )}
        </div>

        {/* CONTENT INFO */}
        <div className="relative flex items-center justify-between w-full flex-wrap gap-1">
          <div className="flex flex-col overflow-hidden gap-1.5">
            <div
              className={cn(
                'flex gap-2 items-center text-[16px] transition-colors duration-100 w-full min-w-0',
                theme.textTitle,
              )}
            >
              <span className="truncate">
                {category
                  ? dbItem?.name
                  : t('incomeModal.categories.categoryPlaceholder')}
              </span>

              {item.intervalUnit && item.intervalUnit !== 'ONCE' && (
                <div
                  className={cn(
                    'flex items-center shrink-0 text-[10px] justify-center sm:text-[14px] lowercase rounded-lg px-2 py-1 leading-none transition-colors duration-300',
                    theme.repeatType,
                  )}
                >
                  {t(`incomeModal.repeat.${item.intervalUnit}`)}
                </div>
              )} 
              {item.receiptsUrls && item.receiptsUrls?.length > 0 && (
                <div
                  className={cn(
                    'flex shrink-0 items-center gap-1 text-[10px] justify-center shadow-md sm:text-[14px] rounded-lg px-3 py-1 leading-none transition-colors duration-100 dark:text-[#E6E6E6]',
                    'bg-linear-to-b dark:from-[#0B151403] dark:via-[#315F551A] dark:to-[#90D0B60D]',
                    'border dark:border-white/10',
                    'group-hover:bg-[#037c5e31]',
                    'dark:group-hover:bg-none dark:group-hover:bg-linear-to-b dark:group-hover:from-[#059979] dark:group-hover:to-[#02624D99]',
                  )}
                >
                  <FileText size={14} />
                  {item?.receiptsUrls?.length > 1
                    ? t('documentsModal.documents')
                    : t('documentsModal.document')}
                </div>
              )}
            </div>
            {/* DESCRIPTION */}
            <span
              className={cn(
                'text-[14px] font-medium transition-colors duration-100 max-w-[140px] truncate whitespace-pre-wrap lg:max-w-full',
                theme.subTitle,
              )}
            >
              {item.description}
            </span>
            <span
              className={cn(
                'text-[10px] first-letter:uppercase transition-colors duration-100',
                theme.dateText,
              )}
            >
              {t(`months.${format(new Date(item.date), 'MMM').toLowerCase()}`)}{' '}
              {format(new Date(item.date), 'dd, yyyy')}
            </span>
          </div>

          {/* AMOUNT AND ACTIONS */}
          <div className="grid grid-cols-[auto_1fr] w-full sm:w-auto gap-2.5 sm:flex items-center sm:gap-5 ml-4 sm:ml-auto">
            <span
              className={cn(
                'text-2xl font-semibold transition-colors duration-100 w-fit',
                theme.amountColor,
              )}
            >
              {theme.amountPrefix} {itemAmount} {CURRENCY_SIGN}
            </span>

            {/* BUTTONS */}
            <div className="absolute top-1/2 right-2 -translate-y-1/2 sm:relative sm:top-0 sm:right-0 sm:translate-y-0 flex align-top gap-4 sm:gap-5 animate-in fade-in slide-in-from-right-2 duration-200 [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className={cn(
                  'flex justify-center items-center size-10 rounded-lg shadow-inner cursor-pointer outline-none',
                  theme.editIconBg,
                )}
              >
                <Pencil
                  className={cn(
                    'size-5 transition-colors duration-300',
                    theme.editIconText,
                    '[@media(hover:none)]:text-[#0B1514] dark:[@media(hover:none)]:text-white',
                  )}
                  strokeWidth={1.5}
                />
              </button>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className={cn(
                  'flex justify-center items-center size-10 rounded-lg shadow-md cursor-pointer transition-all',
                  theme.deleteIconBg,
                )}
              >
                <Trash
                  className={cn(
                    'size-5 transition-colors duration-300',
                    theme.deleteIconText,
                  )}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 ВАРІАНТ 2 — ПОКАЗУЄТЬСЯ НА МОБІЛКАХ ТА MD, ХОВАЄТЬСЯ НА LG (lg:hidden) */}
      {/* ========================================================================= */}
      <div
        onClick={handleContainerClick}
        className={cn(
          'flex lg:hidden', // 🌟 Активний на малюках та md, зникає як тільки екран стає lg
          'group relative w-full flex flex-col items-center justify-start rounded-xl p-5 gap-4 tracking-wider cursor-pointer',
          'bg-white dark:bg-[#193432] border border-slate-100 dark:border-none text-slate-900 dark:text-white',
          'bg-linear-to-b from-transparent to-transparent',
          theme.container,
        )}
      >
        <div className="flex items-center justify-between w-full">
          {/* ICON BOX */}
          <div
            className={cn(
              'size-10 flex justify-center items-center p-3 rounded-lg shrink-0',
              theme.bgIcon,
            )}
          >
            {Icon && (
              <Icon
                className={cn('size-5 transition-colors', theme.textIcon)}
              />
            )}
          </div>

          <div className="flex gap-1">
            {/* REPEAT */}
            {item.intervalUnit && item.intervalUnit !== 'ONCE' && (
              <div
                className={cn(
                  'flex items-center shrink-0 text-[10px] justify-center sm:text-[14px] lowercase rounded-lg px-2 py-1 leading-none transition-colors duration-300',
                  theme.repeatType,
                )}
              >
                {t(`incomeModal.repeat.${item.intervalUnit}`)}
              </div>
            )}
            {/* DOCUMENTS */}
            {item.receiptsUrls && item.receiptsUrls?.length > 0  && (
              <div
                className={cn(
                  'flex shrink-0 items-center gap-1 text-[10px] justify-center shadow-md sm:text-[14px] rounded-lg px-3 py-1 leading-none transition-colors duration-100 dark:text-[#E6E6E6]',
                  'bg-linear-to-b dark:from-[#0B151403] dark:via-[#315F551A] dark:to-[#90D0B60D]',
                  'border dark:border-white/10',
                  'group-hover:bg-[#037c5e31]',
                  'dark:group-hover:bg-none dark:group-hover:bg-linear-to-b dark:group-hover:from-[#059979] dark:group-hover:to-[#02624D99]',
                )}
              >
                <FileText size={14} />
                {item?.receiptsUrls?.length > 1
                  ? t('documentsModal.documents')
                  : t('documentsModal.document')}
              </div>
            )}
          </div>
        </div>

        {/* CONTENT INFO */}
        <div className="flex flex-col items-center justify-start w-full gap-4">
          <div className="flex flex-col justify-start items-start gap-1.5 w-full min-w-0">
            <div
              className={cn(
                'flex gap-2 items-center text-[16px] transition-colors duration-100 w-full min-w-0',
                theme.textTitle,
              )}
            >
              <span className="truncate">
                {category
                  ? dbItem?.name
                  : t('incomeModal.categories.categoryPlaceholder')}
              </span>
            </div>
            {/* DESCRIPTION */}
            <div
              className={cn(
                'text-[14px] font-medium transition-colors duration-100 w-full block whitespace-normal break-words',
                theme.subTitle,
              )}
            >
              {item.description}
            </div>
            {/* DATE */}
            <span
              className={cn(
                'text-[10px] first-letter:uppercase transition-colors duration-100',
                theme.dateText,
              )}
            >
              {t(`months.${format(new Date(item.date), 'MMM').toLowerCase()}`)}{' '}
              {format(new Date(item.date), 'dd, yyyy')}
            </span>
          </div>

          <div className="flex justify-between lg:justify-end items-center gap-5 w-full flex-wrap">
            <span
              className={cn(
                'text-2xl font-semibold transition-colors duration-100 w-fit',
                theme.amountColor,
              )}
            >
              {theme.amountPrefix} {itemAmount} {CURRENCY_SIGN}
            </span>

            {/* BUTTONS */}
            <div className="flex align-top gap-4 sm:gap-5 animate-in fade-in slide-in-from-right-2 duration-200 [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className={cn(
                  'flex justify-center items-center size-10 rounded-lg shadow-inner cursor-pointer outline-none',
                  theme.editIconBg,
                )}
              >
                <Pencil
                  className={cn(
                    'size-5 transition-colors duration-300',
                    theme.editIconText,
                    '[@media(hover:none)]:text-[#0B1514] dark:[@media(hover:none)]:text-white',
                  )}
                  strokeWidth={1.5}
                />
              </button>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className={cn(
                  'flex justify-center items-center size-10 rounded-lg shadow-md cursor-pointer transition-all',
                  theme.deleteIconBg,
                )}
              >
                <Trash
                  className={cn(
                    'size-5 transition-colors duration-300',
                    theme.deleteIconText,
                  )}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛКА ОДНА НА ДВОХ */}
      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        files={item?.receiptsUrls || []}
      />
    </>
  );
};

export default VirtualItem;
