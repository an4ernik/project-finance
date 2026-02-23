import {cn} from '@/lib/utils';
import {useTranslation} from 'react-i18next';
import arrowLight from '@/assets/icons/arrow-light.svg';

export function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex items-center gap-5 p-4 rounded-[5px] backdrop-blur-lg bg-white/80 dark:bg-transparent border border-[rgba(0,0,0,0.08)] dark:border-white/10 [box-shadow:0px_4px_16px_0px_rgba(0,0,0,0.06)] dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] w-full shrink-0">
      <div className="flex items-center justify-center shrink-0 w-40 py-2.5">
        <p className="font-thin text-[100px] leading-[1.167] tracking-[-1.5px] text-[#00aa85] dark:text-[#315e55] w-full text-center">
          {number}
        </p>
      </div>
      <div className="flex flex-col gap-2.5 w-114.25">
        <p className="font-semibold text-[24px] leading-[1.167] tracking-[-1.5px] text-[#0b1514] dark:text-[#bfd9d2]">
          {title}
        </p>
        <p className="text-[16px] leading-[1.167] text-[#6f7e7c] dark:text-[rgba(127,158,151,0.8)]">
          {description}
        </p>
      </div>
    </div>
  );
}

export function HeroCta({onClick}: {onClick: () => void}) {
  const {t} = useTranslation();
  return (
    <button
      onClick={onClick}
      className="relative h-14.5 flex items-center justify-between px-2.5 rounded-[10px] border border-white/65 dark:border-white/25 backdrop-blur-[7px] [background:var(--light-btn-bg-full)] dark:[background:rgba(49,95,85,0.18)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] w-126.5 shrink-0"
    >
      <span className="font-light text-[18px] tracking-[0.5px] text-[#f2f2f2]">
        {t('landing.hero.cta')}
      </span>
      <div className="w-10 h-10 flex items-center justify-center bg-linear-to-l from-emerald-500/80 to-emerald-700 rounded-lg transition-bg duration-200 ease-out hover:bg-(--dark-accent)">
        <img src={arrowLight} alt="" className="size-6" />
      </div>
    </button>
  );
}

export function SecurityItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-11 items-center justify-center">
      <p className="font-extralight text-[150px] leading-[1.167] tracking-[-1.5px] text-[#00aa85] shrink-0">
        {number}
      </p>
      <div className="flex flex-col gap-5.25 w-89">
        <p className="font-bold text-[30px] leading-[1.167] tracking-[-1.5px] text-[#0b1514] dark:text-[#eaf6f3]">
          {title}
        </p>
        <p className="font-semibold text-[20px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97]">
          {description}
        </p>
      </div>
    </div>
  );
}

export function StepCard({
  number,
  title,
  description,
  accent = false,
}: {
  number: string;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-3.5 h-67.5 items-start px-4.5 rounded-[5px] backdrop-blur-lg [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] w-82.5 shrink-0',
        accent
          ? 'bg-linear-to-t from-[rgba(6,227,146,0.8)] from-[3.846%] to-[#027054]'
          : 'bg-white/80 dark:bg-[#193432] border border-[rgba(0,0,0,0.08)] dark:border-transparent',
      )}
    >
      <div className="flex items-center py-2.5 h-29.75 w-30">
        <p
          className={cn(
            'font-thin text-[90px] leading-[1.167] tracking-[-1.5px]',
            accent ? 'text-[#eaf6f3]' : 'text-[#0b1514] dark:text-[#eaf6f3]',
          )}
        >
          {number}
        </p>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <p
          className={cn(
            'font-semibold text-[20px] leading-[1.167] tracking-[-1px]',
            accent ? 'text-[#bfd9d2]' : 'text-[#0b1514] dark:text-[#bfd9d2]',
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-[14px] leading-[1.167]',
            accent
              ? 'text-[#eaf6f3]'
              : 'text-[#6f7e7c] dark:text-[rgba(127,158,151,0.8)]',
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
