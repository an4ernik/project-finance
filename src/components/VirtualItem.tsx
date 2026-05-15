import {FileText, Pencil, Trash} from 'lucide-react';
import {format} from 'date-fns';
import {uk} from 'date-fns/locale';
import {useTranslation} from 'react-i18next';
import {cn} from '@/lib/utils';
import {formattedAmount} from '@/helpers/helpers';
import type {VirtualItemProps} from '@/types/types';
import {CURRENCY_SIGN} from '@/constances/constances';
import {ICONS_BY_ID} from '@/pages/income/IconPicker';
import DocumentModal from './DocumentModal';
import {useState} from 'react';
const THEMES = {
  INCOME: {
    container:
      'hover:bg-[#015E4680] dark:hover:bg-none dark:hover:bg-linear-to-b dark:hover:from-[#059979] dark:hover:to-[#02624D99]',
    bgIcon:
      'bg-[#005E4633] group-hover:bg-[#E6E6E6] dark:bg-[#00AA854D] dark:group-hover:bg-[#02A078]',
    textIcon: 'text-[#005E46] dark:text-[#EAF6F3]',
    textTitle: 'text-[#3A4A48] group-hover:text-[#E6E6E6] dark:text-[#BFD9D2]',
    subTitle: 'text-[#0B1514] group-hover:text-[#E6E6E6] dark:text-[#EAF6F3]',
    dateText: 'text-[#6F7E7C] group-hover:text-[#E6E6E6] dark:text-[#7F9E97]',
    repeatType:
      'bg-[#18B394] text-[#E6E6E6] dark:bg-[#315E55] dark:text-[#EAF6F3]',
    amountColor:
      'text-[#00AA85] group-hover:text-[#EAF6F3] dark:text-[#00AA85] dark:group-hover:text-[#EAF6F3]',
    editIconBg:
      'border border-[#E6E6E6] dark:border-[#e4e4e4]/20  bg-linear-to-b  from-[#0B151403] via-[#315F551A] to-[#90D0B60D]',
    editIconText: 'text-[#EAF6F3] dark:text-[#EAF6F3]',
    deleteIconBg:
      'bg-linear-to-t from-[#CE0000] to-[#C700004D] dark:from-[#CE0000] dark:to-[#C700004D]',
    deleteIconText: 'text-[#E6E6E6] dark:text-[#FFFFFF]',
    amountPrefix: '+',
  },

  EXPENSE: {
    container:
      'hover:bg-[#015E4680] dark:hover:bg-none dark:hover:bg-linear-to-b dark:hover:from-[#AA7D00] dark:hover:to-[#AA7D0033]',

    bgIcon: 'bg-[#005E4633] group-hover:bg-[#E6E6E6] dark:bg-[#AA7D0033]',
    textIcon:
      'text-[#005E46] dark:text-[#AA7D00] dark:group-hover:text-[#EAF6F3]',
    textTitle: 'text-[#3A4A48] group-hover:text-[#E6E6E6] dark:text-[#BFD9D2]',
    subTitle: 'text-[#0B1514] group-hover:text-[#E6E6E6] dark:text-[#EAF6F3]',
    dateText: 'text-[#9A8F80] group-hover:text-[#E6E6E6] dark:text-[#7F9E97]',
    repeatType:
      'bg-[#F4B24D] text-[#FFFFFF] dark:bg-[#AA7D00] dark:text-[#EAF6F3]',
    amountColor:
      'text-[#FF7C02CC] group-hover:text-[#EAF6F3] dark:text-[#AA7D00] dark:group-hover:text-[#EAF6F3]',
    editIconBg:
      'border blur-sm blur-[#E6E6E6] border-[#E6E6E6] dark:border-[#b0b0b0] dark:border-[#e4e4e4]/20 bg-linear-to-b from-[#0B151403] via-[#315F551A] to-[#90D0B60D] dark:bg-[rgba(234,246,243,0.14)]',
    editIconText: 'text-[#E6E6E6] dark:text-[#EAF6F3]',
    deleteIconBg:
      'bg-linear-to-t from-[#CE0000] to-[#C700004D] dark:from-[#CE0000] dark:to-[#C700004D]',
    deleteIconText: 'text-[#E6E6E6] dark:text-[#FFFFFF]',
    amountPrefix: '-',
  },
};

export const VirtualItem = ({
  item,
  type = 'INCOME',
  onEdit,
  onDelete,
}: VirtualItemProps) => {
  const {t} = useTranslation();
  const theme = THEMES[type];
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
                'text-[14px] font-medium transition-colors duration-100 max-w-[140px] truncate lg:max-w-full',
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
              {format(new Date(item.date), 'MMM d, yyyy', {locale: uk}).replace(
                '.',
                '',
              )}
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
