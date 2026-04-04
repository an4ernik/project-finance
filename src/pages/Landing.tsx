import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/shared/providers/ThemeProvider';
import Header from '@/components/ui/Header';
import heroImg from '@/assets/landing-hero-image.png';
import mailIcon from '@/assets/icons/mail.svg';
import Logo from '@/components/ui/Logo';
import mailDark from '@/assets/icons/mail-dark.svg';
import arrowLight from '@/assets/icons/arrow-light.svg';
import {
  FeatureCard,
  StepCard,
  SecurityItem,
  HeroCta,
} from '@/components/landing/LandingComponents';
import {getFeatures, getSteps, getSecurity} from '@/lib/landing-data';
import IncomeModal from '@/components/ui/IncomeModal';

function Landing() {
  const navigate = useNavigate();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const isDark = theme === 'dark';

  const features = getFeatures(t);
  const steps = getSteps(t);
  const security = getSecurity(t);

  return (
    <div className="bg-[--light-background] dark:bg-[--dark-background] overflow-x-hidden">
      <IncomeModal edit={false}  onClose={() => {}} />
      <section className="relative overflow-hidden">
        <Header />

        {/* Mobile hero */}
        <div className="flex flex-col items-center min-h-screen pt-16.25 pb-10 px-6 gap-6.75 md:hidden">
          <div className="flex flex-col items-center text-center pt-6">
            <div className="flex items-baseline gap-5 justify-center px-5">
              <span className="font-mplus font-thin text-[36px] leading-13.5 text-[#0b1514] dark:text-[#eaf6f3]">
                {t('landing.hero.word1')}
              </span>
              <span className="font-unbounded font-extralight text-[40px] leading-15 text-[#00aa85] opacity-80">
                {t('landing.hero.word2')}
              </span>
            </div>
            <span className="font-unbounded font-extralight text-[40px] leading-15 tracking-[2px] text-[#0b1514] dark:text-[#eaf6f3]">
              {t('landing.hero.word3')}
            </span>
          </div>

          <div className="w-125">
            <img src={heroImg} alt="Budget illustration" />
          </div>

          <div className="flex flex-col items-center text-center gap-0.5">
            <p className="font-light text-[24px] leading-[1.167] text-[#0b1514] dark:text-[#bfd9d2]">
              {t('landing.hero.tagline')}
            </p>
            <p className="font-extralight text-[18px] leading-6.75 text-[#6f7e7c] dark:text-[#5a736e] opacity-80">
              {t('landing.hero.subtitle')}
            </p>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => navigate('/signup')}
              className="flex justify-between items-center cursor-pointer relative h-12.5 md:h-14.5 px-4 rounded-[10px] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] w-full md:w-126.5 shrink-0 bg-linear-to-t from-[rgba(2,160,120,0.3)] via-[rgba(2,160,120,0.5)] to-[rgba(2,160,120,0.8)] md:border-white/25 md:[background:rgba(49,95,85,0.18)]"
            >
              <span className="font-medium md:font-light text-[16px] md:text-[18px] tracking-[-1.5px] md:tracking-[0.5px] text-[#e6e6e6]">
                {t('landing.hero.cta')}
              </span>
              <img src={arrowLight} alt="" className="size-4 " />
            </button>
            {/* Log in — glass button */}
            <button
              onClick={() => navigate('/login')}
              className="relative h-10 flex items-center justify-center rounded-xl cursor-pointer backdrop-blur-[7px] bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)] w-full"
            >
              <span className="font-normal text-[14px] leading-[1.167] text-[#0b1514] dark:text-[#eaf6f3]">
                {t('auth.confirmed.button')}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop hero */}
        <div className="hidden md:flex relative min-h-screen items-center px-5 pt-0">
          <div className="relative w-1/2 flex items-center">
            <img src={heroImg} alt="Budget illustration" />
          </div>

          <div className="w-1/2 flex flex-col gap-13">
            <div className="flex flex-col gap-7">
              <div>
                <div className="flex items-baseline gap-3.25">
                  <span className="font-mplus font-thin text-[80px] leading-none tracking-[1px] text-[#0b1514] dark:text-[#bfd9d2]">
                    {t('landing.hero.word1')}
                  </span>
                  <span className="font-unbounded font-extralight text-[80px] leading-none tracking-[-2px] text-[#00aa85]">
                    {t('landing.hero.word2')}
                  </span>
                </div>
                <div className="relative">
                  <span className="font-unbounded font-extralight text-[90px] leading-none tracking-[6px] text-[#0b1514] dark:text-[#eaf6f3]">
                    {t('landing.hero.word3')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-7">
                <p className="font-bold text-[24px] leading-[1.167] tracking-[1px] text-[#0b1514] dark:text-(--dark-text-secondary)">
                  {t('landing.hero.tagline')}
                </p>
                <p className="font-semibold text-[20px] leading-[1.167] tracking-[0.5px] text-[#3a4a48] dark:text-(--dark-text-tertiary)">
                  {t('landing.hero.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <HeroCta onClick={() => navigate('/signup')} />
              <p className="text-[16px] leading-[1.167] text-[#6f7e7c] dark:text-[#7f9e97]">
                {t('landing.hero.ctaNote1')}
                <br />
                {t('landing.hero.ctaNote2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* about*/}
      <section id="about" className="min-h-screen">
        <div className="px-6 md:px-12.5 py-14">
          <div className="flex flex-col gap-3">
            <h2 className="flex flex-col md:flex-row gap-3.75 justify-center md:justify-end items-center font-unbounded font-extralight text-[40px] md:text-[70px] leading-none tracking-[-1.5px] text-center md:text-right">
              <span className="text-[#00aa85]">
                {t('landing.about.titleAccent')}
              </span>
              <span className="text-[#0b1514] dark:text-[#eaf6f3]">
                {t('landing.about.titlePlain')}
              </span>
            </h2>
            <p className="font-semibold text-[16px] md:text-[24px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97] mt-4 text-center md:text-right md:flex md:justify-end">
              {t('landing.about.subtitle')}
            </p>
          </div>

          {/* Mobile: single column */}
          <div className="flex flex-col gap-4 mt-10 md:hidden">
            {features.map(f => (
              <FeatureCard key={f.number} {...f} />
            ))}
          </div>

          {/* Desktop: two-column staggered */}
          <div className="hidden md:flex gap-10 mt-12.5">
            <div className="flex flex-col gap-40 pt-38 flex-1">
              <FeatureCard {...features[1]} />
              <FeatureCard {...features[3]} />
            </div>
            <div className="flex flex-col gap-40 flex-1">
              <FeatureCard {...features[0]} />
              <FeatureCard {...features[2]} />
            </div>
          </div>
        </div>
      </section>

      {/*how it works*/}
      <section id="how-it-works" className="min-h-screen">
        <div className="px-6 md:px-12.5 py-14">
          <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between mb-4">
            <div className="text-center md:text-left">
              <h2 className="flex gap-3 items-center flex-wrap justify-center md:justify-start font-unbounded font-extralight text-[36px] md:text-[70px] leading-none tracking-[-1.5px]">
                <span className="text-[#0b1514] dark:text-[#eaf6f3]">
                  {t('landing.howItWorks.titleWord1')}
                </span>
                <span className="text-[#00aa85]">
                  {t('landing.howItWorks.titleWord2')}
                </span>
                <span className="text-[#0b1514] dark:text-[#eaf6f3]">
                  {t('landing.howItWorks.titleWord3')}
                </span>
              </h2>
              <p className="font-semibold text-[16px] md:text-[24px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97] mt-4">
                {t('landing.howItWorks.subtitle')}
              </p>
            </div>
          </div>

          {/* Mobile: single column + CTA */}
          <div className="flex flex-col gap-4 mt-8 md:hidden">
            {steps.map(s => (
              <StepCard key={s.number} {...s} />
            ))}
            <HeroCta onClick={() => navigate('/signup')} />
          </div>

          {/* Desktop: staggered grid */}
          <div className="hidden md:flex gap-4.25 mt-12.5">
            <div className="flex flex-col gap-12.5">
              <div className="flex gap-9.75">
                <StepCard {...steps[0]} />
                <StepCard {...steps[1]} />
              </div>
              <div className="flex flex-col gap-11.5">
                <p className="text-[16px] leading-[1.167] text-[#6f7e7c] dark:text-[#7f9e97] w-39.25">
                  {t('landing.howItWorks.note')}
                </p>
                <HeroCta onClick={() => navigate('/signup')} />
              </div>
            </div>

            <div className="flex gap-7 items-end">
                <StepCard {...steps[3]} />
              <div className="flex flex-col gap-20.25">
              <StepCard {...steps[2]} />
                <StepCard {...steps[4]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* security */}
      <section id="security" className="min-h-screen">
        <div className="px-6 md:px-12.5 py-14">
          <div className="flex w-full flex-col gap-5.5 items-center md:items-end mb-10 md:mb-28">
            <h2 className="flex flex-col md:flex-row gap-3.7 items-center font-unbounded font-extralight text-[36px] md:text-[60px] leading-none tracking-[-1.5px] text-center md:text-right">
              <span className="text-[#0b1514] dark:text-[#eaf6f3]">
                {t('landing.security.titleWord1')}
              </span>
              <span className="text-[#00aa85]">
                {t('landing.security.titleWord2')}
              </span>
            </h2>
            <p className="font-semibold text-[16px] md:text-[24px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97] text-center md:text-right">
              {t('landing.security.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11 gap-y-10 md:gap-y-40 place-items-center">
            {security.map(item => (
              <SecurityItem key={item.number} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative border-t border-[rgba(0,0,0,0.08)] dark:border-white/[0.14] backdrop-blur-md [box-shadow:0px_-4px_16px_0px_rgba(0,0,0,0.06)] dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.35),0px_4px_4px_0px_rgba(75,75,75,0.25)]">
        {/* Mobile footer */}
        <div className="flex flex-col items-center gap-3 py-7 md:hidden">
          <Logo className="h-9" />
          <div className="flex flex-col items-center gap-0.75">
            <p className="text-[14px] leading-[1.167] tracking-[-1.5px] text-[#0b1514] dark:text-[#eaf6f3]">
              Monity 2026
            </p>
            <p className="text-[10px] leading-[1.167] text-[#6f7e7c] dark:text-[#7f9e97]">
              {t('landing.footer.rights')}
            </p>
          </div>
        </div>

        {/* Desktop footer */}
        <div className="hidden md:block h-39.5 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-between px-13.75">
            <Logo className="h-9" />

            <div className="flex flex-col items-center gap-0.75">
              <p className="text-[16px] leading-[1.167] tracking-[-1.5px] text-[#0b1514] dark:text-[#eaf6f3]">
                Monity 2026
              </p>
              <p className="text-[10px] leading-[1.167] text-[#6f7e7c] dark:text-[#7f9e97]">
                {t('landing.footer.rights')}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-0.5 items-end text-right">
                <p className="text-[16px] leading-[1.167] tracking-[-1px] text-[#0b1514] dark:text-[#eaf6f3]">
                  {t('landing.footer.question')}
                </p>
                <p className="text-[16px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97]">
                  {t('landing.footer.contact')}
                </p>
              </div>
              <button className="relative flex items-center justify-center size-12.5 rounded-[10px] border border-[rgba(0,0,0,0.12)] dark:border-white/65 dark:bg-linear-to-b dark:from-[rgba(11,21,20,0.03)] dark:via-[rgba(49,95,85,0.1)] dark:to-[rgba(144,208,182,0.05)] backdrop-blur-lg [box-shadow:0px_4px_16px_0px_rgba(0,0,0,0.06)] dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)] opacity-50 hover:opacity-100 transition-opacity">
                <img
                  src={isDark ? mailIcon : mailDark}
                  alt="Contact"
                  className="size-8 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
