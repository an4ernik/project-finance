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

  console.log(item, 'item');

   return (
    <>
      <div
        onClick={handleContainerClick}
        className={cn(
          'group relative min-h-[112px] flex items-center rounded-xl p-5 gap-4 tracking-wider cursor-pointer',
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
        <div className="relative flex items-center justify-between w-full flex-wrap gap-4">
          <div className="flex flex-col">
            <div
              className={cn(
                'flex gap-2 items-center text-[16px] transition-colors duration-100',
                theme.textTitle,
              )}
            >
              {category
                ? dbItem?.name
                : t('incomeModal.categories.categoryPlaceholder')}
              {item.intervalUnit && item.intervalUnit !== 'ONCE' && (
                <div
                  className={cn(
                    'flex items-center text-[10px] justify-center sm:text-[14px] lowercase rounded-lg px-2 py-0.5 leading-none transition-colors duration-300',
                    theme.repeatType,
                  )}
                >
                  {t(`incomeModal.repeat.${item.intervalUnit}`)}
                </div>
              )}
              {item.receiptsUrls && item.receiptsUrls?.length > 0 && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-[10px] justify-center shadow-md sm:text-[14px] rounded-lg px-3 py-1 leading-none transition-colors duration-100  dark:text-[#E6E6E6]',
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
            {t(`months.${format(new Date(item.date), 'MMM').toLowerCase()}`)} {format(new Date(item.date), 'dd, yyyy')}
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

            {/* BUTTONS - Use stopPropagation to prevent modal opening */}
            <div className="absolute top-1/2 right-2 -translate-y-1/2 sm:relative sm:top-0 sm:right-0 sm:translate-y-0 flex align-top gap-4 sm:gap-5 animate-in fade-in slide-in-from-right-2 duration-200 [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation(); // CRITICAL: Stop the parent onClick from firing
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
                  e.stopPropagation(); // CRITICAL: Stop the parent onClick from firing
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

      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        files={item?.receiptsUrls || []}
      />
    </>
  );
};

export default VirtualItem;
