import {useEffect, useRef} from 'react';
import {Info} from 'lucide-react'; 
import {cn} from '@/lib/utils';

export type RecurringUpdateScope = 'this_only' | 'all_future';

type Props = {
  isOpen: boolean;
  onClose: (scope: RecurringUpdateScope | null) => void;
  selectedScope: RecurringUpdateScope;
  setSelectedScope: (scope: RecurringUpdateScope) => void;
};

const optionButtonClasses = cn(
  'flex flex-col items-start gap-1 p-4 w-full rounded-2xl border transition-all duration-200 text-left outline-none cursor-pointer',
  'border-[#1c3f35] bg-linear-to-b from-[#11241e05] via-[#11241e0a] to-[#11241e01]',
  'focus-visible:ring-2 focus-visible:ring-[#04C89E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08120F]',
);

const activeGradient = cn(
  'border-[#04C89E] [box-shadow:inset_0px_1px_1px_0px_rgba(255,255,255,0.25)]',
  'bg-linear-to-r from-[#02A078] via-[#028F6A] to-[#04C89E]',
);

const InfoDialog = ({
  isOpen,
  onClose,
  selectedScope,
  setSelectedScope,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Закриття по Esc
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => onClose(null)}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className={cn(
          'relative z-10 w-full max-w-[420px] transform overflow-hidden rounded-[26px] p-6 text-left shadow-2xl transition-all',
          'bg-[#08120F] border border-[#1c3f35] text-[#EAF6F3]',
          'animate-in zoom-in-95 fade-in duration-200',
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-[#1c3f35]/50 border border-[#1c3f35]">
            <Info className="size-5 text-[#9AA7A5]" />
          </div>
          <h3 className="text-xl font-medium tracking-tight">
            Застосувати зміни до:
          </h3>
        </div>

        {/* Description */}
        <p className="text-base text-[#9AA7A5] leading-relaxed mb-6">
          Це повторюваний дохід. Оберіть, як застосувати зміни.
        </p>

        {/* Options */}
        <div className="space-y-3 mb-8">
          <button
            type="button"
            onClick={() => setSelectedScope('this_only')}
            className={cn(
              optionButtonClasses,
              selectedScope === 'this_only' && activeGradient,
            )}
          >
            <span className="font-semibold text-lg text-white">
              Лише цей дохід
            </span>
            <span
              className={cn(
                'text-xs',
                selectedScope === 'this_only'
                  ? 'text-white/80'
                  : 'text-[#9AA7A5]',
              )}
            >
              Оновити тільки цей запис
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScope('all_future')}
            className={cn(
              optionButtonClasses,
              selectedScope === 'all_future' && activeGradient,
            )}
          >
            <span className="font-semibold text-lg text-white">
              Цей і всі майбутні доходи
            </span>
            <span
              className={cn(
                'text-xs',
                selectedScope === 'all_future'
                  ? 'text-white/80'
                  : 'text-[#9AA7A5]',
              )}
            >
              Оновити всі майбутні повторювані записи
            </span>
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose(null)}
            className="px-6 py-2.5 rounded-xl text-lg font-medium bg-[#121E1B] text-[#EAF6F3] border border-[#1c3f35] hover:bg-[#1c3f35]/30 cursor-pointer"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={() => onClose(selectedScope)}
            className={cn(
              'px-6 py-2.5 rounded-xl text-lg font-medium text-white cursor-pointer transition-all hover:brightness-110',
              activeGradient,
            )}
          >
            Застосувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;
