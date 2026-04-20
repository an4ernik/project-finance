import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {cn} from '@/lib/utils';

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
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'w-full max-w-[357px] rounded-[10px] border border-white/[0.14] p-5',
          'bg-[var(--glass-bg)] [box-shadow:var(--glass-shadow)] backdrop-blur-[24px]',
        )}
      >
        <DialogHeader className="gap-3 text-left">
          <DialogTitle className="text-[24px] font-medium leading-[1.167]">
            {title}
          </DialogTitle>
          {description ? (
            <p className="text-[14px] leading-[1.167] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </DialogHeader>

        <DialogFooter className="mt-6 flex-row justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 w-[140px]"
            variant="secondary"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            variant={
              confirmVariant === 'destructive' ? 'destructive' : 'primary'
            }
            className={cn('h-9 w-[140px]')}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
