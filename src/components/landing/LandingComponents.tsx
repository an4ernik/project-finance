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
    <div className="relative flex max-w-full shrink-0 items-center gap-4 rounded-[5px] bg-white/80 p-4 backdrop-blur-lg dark:bg-transparent lg:gap-5 lg:border lg:border-[rgba(0,0,0,0.08)] lg:[box-shadow:0px_4px_16px_0px_rgba(0,0,0,0.06)] lg:dark:border-white/10 lg:dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]">
      <div className="flex w-14 shrink-0 items-center justify-center py-2.5 lg:w-32 xl:w-40">
        <p className="text-[60px] leading-[1.167] font-thin tracking-[-1.5px] text-[#00aa85] lg:text-[96px] xl:text-[120px]">
          {number}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2 lg:gap-2.5 xl:max-w-114.25">
        <p className="text-[16px] leading-[1.167] font-semibold tracking-[-1.5px] text-[#0b1514] dark:text-[#bfd9d2] xl:text-[24px]">
          {title}
        </p>
        <p className="text-[13px] leading-[1.167] text-[#6f7e7c] dark:text-[rgba(127,158,151,0.8)] xl:text-[16px]">
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
      className="relative flex h-12.5 w-full shrink-0 cursor-pointer items-center justify-between rounded-[10px] bg-linear-to-t from-[rgba(2,160,120,0.3)] via-[rgba(2,160,120,0.5)] to-[rgba(2,160,120,0.8)] px-2.5 backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] lg:h-14.5 lg:w-full lg:max-w-126.5 lg:border-white/25 lg:[background:rgba(49,95,85,0.18)] xl:w-115"
    >
      <span className="text-[16px] font-medium tracking-[-1.5px] text-text-primary lg:text-[18px] lg:font-light lg:tracking-[0.5px]">
        {t('landing.hero.cta')}
      </span>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-l from-emerald-500/80 to-emerald-700 transition-bg duration-200 ease-out hover:bg-(--dark-accent)">
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
    <div className="flex max-w-80.5 items-center gap-5 lg:max-w-140 lg:gap-[15px]">
      <p className="w-16 shrink-0 text-[60px] leading-[1.167] font-extralight tracking-[-1.5px] text-[#00aa85] lg:w-[140px] lg:text-[120px] xl:w-[175px] xl:text-[150px]">
        {number}
      </p>
      <div className="flex flex-1 flex-col gap-2.5 lg:gap-5.25 xl:w-89">
        <p className="text-[18px] leading-[1.167] font-bold tracking-[-1.5px] text-[#0b1514] dark:text-[#eaf6f3] lg:text-[26px] xl:text-[30px]">
          {title}
        </p>
        <p className="text-[13px] leading-[1.167] font-semibold tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97] lg:text-[18px] xl:text-[20px]">
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
        'relative flex h-auto max-w-full min-w-0 shrink-0 flex-col items-center px-4.5 py-4 text-wrap',
        '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]',
        // compact/tablet: Figma dark glass card
        'max-lg:gap-2 max-lg:rounded-[14px] max-lg:backdrop-blur-lg',
        'max-lg:bg-linear-to-b max-lg:from-[rgba(11,21,20,0.01)] max-lg:via-[rgba(49,95,85,0.1)] max-lg:via-1/2 max-lg:to-[rgba(144,208,182,0.05)]',
        // desktop: dark glass card
        'md:gap-3.5 md:rounded-[5px] md:bg-[#193432] md:items-start md:py-0 md:min-h-67.5 md:backdrop-blur-lg',
        accent
          ? 'md:w-72 xl:w-82.5 md:bg-linear-to-t md:from-[rgba(6,227,146,0.8)] md:from-[3.846%] md:to-[#027054]'
          : 'md:w-72 xl:w-82.5',
      )}
    >
      <div className="flex h-18 w-30 items-center py-2.5 md:h-29.75">
        <p
          className={cn(
            'w-full text-center leading-[1.167] tracking-[-1.5px] md:text-left',
            'max-lg:font-unbounded max-lg:text-[50px] max-lg:font-extralight max-lg:text-[#00aa85]',
            'md:text-[80px] md:font-thin md:text-[#eaf6f3] xl:text-[90px]',
          )}
        >
          {number}
        </p>
      </div>
      <div className="flex w-full flex-col gap-4 text-center md:gap-6 md:text-left">
        <p
          className={cn(
            'text-[18px] leading-[1.167] font-semibold tracking-[-1px] md:text-[22px] xl:text-[24px]',
            'max-lg:text-white md:text-[#bfd9d2]',
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-[13px] leading-[1.167] md:pb-5 xl:text-[16px]',
            'max-lg:text-[#5a736e]',
            accent ? 'md:text-[#eaf6f3]' : 'md:text-[#7f9e97]',
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
