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
    <div className="relative flex items-center gap-4 md:gap-5 p-4 rounded-[5px] backdrop-blur-lg bg-white/80 dark:bg-transparent md:border md:border-[rgba(0,0,0,0.08)] md:dark:border-white/10 md:[box-shadow:0px_4px_16px_0px_rgba(0,0,0,0.06)] md:dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] w-full shrink-0">
      <div className="flex items-center justify-center shrink-0 w-14 md:w-40 py-2.5">
        <p className="font-thin text-[60px] md:text-[120px] leading-[1.167] tracking-[-1.5px] text-[#00aa85] ">
          {number}
        </p>
      </div>
      <div className="flex flex-col gap-2 md:gap-2.5 flex-1 md:w-114.25">
        <p className="font-semibold text-[16px] md:text-[24px] leading-[1.167] tracking-[-1.5px] text-[#0b1514] dark:text-[#bfd9d2]">
          {title}
        </p>
        <p className="text-[13px] md:text-[16px] leading-[1.167] text-[#6f7e7c] dark:text-[rgba(127,158,151,0.8)]">
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
      className="relative h-12.5 md:h-14.5 flex items-center cursor-pointer justify-between px-2.5 rounded-[10px] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] w-full md:w-126.5 shrink-0 bg-linear-to-t from-[rgba(2,160,120,0.3)] via-[rgba(2,160,120,0.5)] to-[rgba(2,160,120,0.8)] md:border-white/25 md:[background:rgba(49,95,85,0.18)]"
    >
      <span className="font-medium md:font-light text-[16px] md:text-[18px] tracking-[-1.5px] md:tracking-[0.5px] text-text-primary">
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
    <div className="flex gap-5 md:gap-[15px] items-center max-w-80.5 md:max-w-140">
      <p className="font-extralight text-[60px] md:text-[150px] leading-[1.167] tracking-[-1.5px] text-[#00aa85] shrink-0 w-16 md:w-[175px]">
        {number}
      </p>
      <div className="flex flex-col gap-2.5 md:gap-5.25 flex-1 md:w-89">
        <p className="font-bold text-[18px] md:text-[30px] leading-[1.167] tracking-[-1.5px] text-[#0b1514] dark:text-[#eaf6f3]">
          {title}
        </p>
        <p className="font-semibold text-[13px] md:text-[20px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97]">
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
        'relative flex flex-col h-auto items-center px-4.5 py-4 w-full shrink-0',
        '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]',
        // mobile: Figma dark glass card
        'max-md:gap-2 max-md:rounded-[14px] max-md:backdrop-blur-lg',
        'max-md:bg-linear-to-b max-md:from-[rgba(11,21,20,0.01)] max-md:via-[rgba(49,95,85,0.1)] max-md:via-1/2 max-md:to-[rgba(144,208,182,0.05)]',
        // desktop: dark glass card (always dark, no border)
        'md:gap-3.5 md:rounded-[5px] md:backdrop-blur-lg md:bg-[#193432] md:items-start md:py-0 md:h-67.5',
        accent
          ? 'md:w-82.5 md:bg-linear-to-t md:from-[rgba(6,227,146,0.8)] md:from-[3.846%] md:to-[#027054]'
          : 'md:w-82.5',
      )}
    >
      <div className="flex items-center py-2.5 h-18 md:h-29.75 w-30">
        <p
          className={cn(
            'leading-[1.167] tracking-[-1.5px] w-full text-center md:text-left',
            'max-md:font-unbounded max-md:font-extralight max-md:text-[50px] max-md:text-[#00aa85]',
            'md:font-thin md:text-[90px] md:text-[#eaf6f3]',
          )}
        >
          {number}
        </p>
      </div>
      <div className="flex flex-col gap-4 md:gap-6 w-full text-center md:text-left">
        <p
          className={cn(
            'font-semibold text-[18px] md:text-[24px] leading-[1.167] tracking-[-1px]',
            'max-md:text-white md:text-[#bfd9d2]',
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-[13px] md:text-[16px] leading-[1.167]',
            'max-md:text-[#5a736e]',
            accent ? 'md:text-[#eaf6f3]' : 'md:text-[#7f9e97]',
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
