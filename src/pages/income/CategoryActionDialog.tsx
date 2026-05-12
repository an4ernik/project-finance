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

type Props = {
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
  transferPlaceholder = 'Виберіть категорію',
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'w-full rounded-[10px] border border-white/[0.14] bg-[#142624] [box-shadow:var(--glass-shadow)] backdrop-blur-[32px]',
          showTransfer
            ? 'max-w-[500px] gap-[55px] p-[25px]'
            : 'max-w-[357px] gap-0 p-5',
        )}
      >
        <DialogHeader className="gap-3 text-left">
          <DialogTitle
            className={cn(
              'font-medium leading-[1.167]',
              showTransfer ? 'text-[16px]' : 'text-[24px]',
            )}
          >
            {title}
          </DialogTitle>
          {description && !showTransfer ? (
            <p className="text-[14px] leading-[1.167] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </DialogHeader>

        {showTransfer ? (
          <div className="flex flex-col gap-4">
            <div className="flex min-h-16 items-center gap-3 rounded-[10px] border border-[#CE0000] bg-linear-to-b from-[rgba(199,0,0,0.2)] to-[rgba(199,0,0,0.3)] px-[13px] py-3">
              <OctagonAlert className="size-6 shrink-0 text-[#EAF6F3]" />
              <p className="text-[14px] leading-[1.167] text-[#EAF6F3]">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-[1.167] text-[#BFD9D2]">
                {transferLabel}
              </label>
              <Select
                value={selectedTransferId}
                onValueChange={onTransferChange}
              >
                <SelectTrigger className="h-10 w-full border-white/25 bg-[var(--input-bg-placeholder)] text-foreground">
                  <SelectValue placeholder={transferPlaceholder} />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#193432] text-foreground">
                  {transferOptions.map(category =>
                    category.id ? (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        <DialogFooter className="flex-row justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn('h-9', showTransfer ? 'w-[120px]' : 'w-[140px]')}
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
            className={cn('h-9', showTransfer ? 'w-[120px]' : 'w-[140px]')}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
