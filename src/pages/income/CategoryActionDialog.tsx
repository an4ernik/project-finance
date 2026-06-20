import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {cn} from '@/lib/utils';
import type {CategoryResponseDTO} from '@/shared/api/models';
import {OctagonAlert} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  type?: 'INCOME' | 'EXPENSE';
  categoryName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'destructive';
  onConfirm: () => void;
  isPending?: boolean;
  showTransfer?: boolean;
  transferOptions?: CategoryResponseDTO[];
  selectedTransferId?: string;
  onTransferChange?: (id: string) => void;
  transferLabel?: string;
  transferPlaceholder?: string;
};

export default function CategoryActionDialog({
  type = 'INCOME',
  categoryName,
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  isPending,
  showTransfer,
  transferOptions = [],
  selectedTransferId,
  onTransferChange,
  transferLabel = 'Перенести до категорії',
  transferPlaceholder = 'Оберіть категорію',
}: Props) {
  const {t} = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'w-[calc(100%-32px)] sm:w-full rounded-[10px] border border-white/[0.14] bg-[#FAFAFA] dark:bg-[#142624] [box-shadow:var(--glass-shadow)] backdrop-blur-[32px]',
          showTransfer
            ? 'max-w-[550px] gap-[35px] p-[25px]'
            : 'max-w-[357px] gap-0 p-5',
        )}
      >
        <DialogHeader className="gap-3 text-left">
          <DialogTitle
            className={cn(
              'font-medium leading-[1.167]',
              showTransfer ? 'text-base' : 'text-lg',
            )}
          >
            {title}
            {/* Цю дію неможливо скасувати. */}
          </DialogTitle>
          {/* {description && showTransfer ? (
            <p className="text-[14px] leading-[1.167] text-muted-foreground">
              {description} 
            </p>
          ) : null} */}
        </DialogHeader>

        {showTransfer ? (
          <div className="flex flex-col gap-4">
            <div className="flex min-h-16 items-center gap-3 rounded-[10px] border border-[#CE0000] bg-linear-to-b from-[rgba(199,0,0,0.2)] to-[rgba(199,0,0,0.3)] px-[13px] py-3">
              <OctagonAlert className="size-6 shrink-0 dark:text-[#EAF6F3]" />
              <div className="flex flex-col gap-1">
                <p className="text-[12px] sm:text-base leading-[1.167] dark:text-[#EAF6F3]">
                  {description}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#BFD9D2] leading-relaxed">
                  {t(
                    `${type.toLowerCase()}.categories.modals.deleteSubTextStart`,
                  )}{' '}
                  <span className="font-semibold text-[12px] sm:text-[14px] text-foreground">
                    {categoryName}, {' '}
                  </span>
                  {t(
                    `${type.toLowerCase()}.categories.modals.deleteSubTextEnd`,
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label className="leading-[1.167] dark:text-[#BFD9D2]">
                {transferLabel}
              </label>
              <Select
                value={selectedTransferId}
                onValueChange={onTransferChange}
              >
                <SelectTrigger className="h-10 w-full border-white/25 bg-[var(--input-bg-placeholder)] text-foreground">
                  <SelectValue placeholder={transferPlaceholder} />
                </SelectTrigger>
                <SelectContent className="border-white/10 dark:bg-[#193432] text-foreground">
                  {transferOptions.map(category =>
                    category.id ? (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                        className="dark:text-[#EAF6F3]"
                      >
                        {category.name}
                      </SelectItem>
                    ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        <DialogFooter className="flex-col sm:flex-row justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(
              'sm:h-9 w-full',
              showTransfer ? 'sm:max-w-[120px]' : 'sm:max-w-[140px]',
              'shrink sm:shrink-0',
            )}
            variant="secondary"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending || (showTransfer && !selectedTransferId)}
            variant={
              confirmVariant === 'destructive' ? 'destructive' : 'primary'
            }
            className={cn(
              'sm:h-9 w-full',
              showTransfer ? 'sm:max-w-[120px]' : 'sm:max-w-[140px]',
              'shrink  sm:shrink-0',
            )}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
