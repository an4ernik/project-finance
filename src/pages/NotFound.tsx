import {Link} from 'react-router-dom';
import {Home, AlertCircle, ChevronLeft} from 'lucide-react';
import {cn} from '@/lib/utils'; 
import {Button} from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div className="absolute inset-0 z-0 opacity-30 dark:bg-radial-fade" />
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-900/20 blur-[120px]" />
      <div className="z-10 flex max-w-lg flex-col items-center text-center">
        <div className="relative">
          <h1 className="text-[120px] font-black leading-none tracking-tighter text-emerald-500/20 sm:text-[180px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="size-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
          </div>
        </div>

        <div
          className={cn(
            'mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 p-8 backdrop-blur-xl',
            'bg-linear-to-b from-white/5 to-white/[0.02] shadow-2xl',
          )}
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Шлях до прибутку втрачено
          </h2>
          <p className="text-emerald-100/60">
            Здається, ви намагаєтеся отримати доступ до транзакції або сторінки,
            якої не існує. Можливо, посилання застаріло або сталася помилка в
            балансі.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button 
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="size-4" />
                На головну
              </Link>
            </Button>

            <Button
              className="border-emerald-800 text-emerald-400 hover:bg-emerald-950"
            >
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="size-4" />
                Назад
              </button>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
