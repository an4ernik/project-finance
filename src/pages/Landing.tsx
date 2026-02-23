import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/shared/providers/ThemeProvider';
import Header from '@/components/ui/Header';
import heroImg from '@/assets/landing-hero-image.png';
import logo from '@/assets/icons/logo.svg';
import darkLogo from '@/assets/icons/logo-dark.svg';
import mailIcon from '@/assets/icons/mail.svg';
import mailDark from '@/assets/icons/mail-dark.svg';
import {
  FeatureCard,
  StepCard,
  SecurityItem,
  HeroCta,
} from '@/components/landing/LandingComponents';
import {getFeatures, getSteps, getSecurity} from '@/lib/landing-data';

//  TODO: cursor-pointer on interactive elements 
//        routing to the / page on the top OR creating a 'go up' button


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
      <section className="relative min-h-screen overflow-hidden">
        <Header />
        {/* main content */}
        <div className="relative flex min-h-screen items-center px-5 pt-0">
          <div className="relative w-1/2 flex items-center">
            <img src={heroImg} alt="Budget illustration" />
          </div>

          {/* right text  */}
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

      {/* about service */}
      <section id="about" className="min-h-screen">
        <div className="px-12.5 py-14">
          <div className="flex flex-col  gap-3">
            <h2 className="flex gap-3.75 justify-end items-center font-unbounded font-extralight text-[70px] leading-none tracking-[-1.5px]">
              <span className="text-[#00aa85]">
                {t('landing.about.titleAccent')}
              </span>
              <span className="text-[#0b1514] dark:text-[#eaf6f3]">
                {t('landing.about.titlePlain')}
              </span>
            </h2>
            <p className="flex justify-end font-semibold text-[24px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97] mt-4">
              {t('landing.about.subtitle')}
            </p>
          </div>

          {/* two-column cards */}
          <div className="flex gap-10 mt-12.5">
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

      {/* how it works */}
      <section id="how-it-works" className="min-h-screen">
        <div className="px-12.5 py-14">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="flex gap-3 items-center flex-wrap font-unbounded font-extralight text-[70px] leading-none tracking-[-1.5px]">
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
              <p className="font-semibold text-[24px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97] mt-4">
                {t('landing.howItWorks.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex gap-4.25 mt-12.5">
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
              <StepCard {...steps[2]} />
              <div className="flex flex-col gap-20.25">
                <StepCard {...steps[3]} />
                <StepCard {...steps[4]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* security */}
      <section id="security" className="min-h-screen">
        <div className="px-12.5 py-14">
          <div className="flex justify-between items-start mb-28">
            <div className="flex w-full flex-col gap-5.5 items-end">
              <h2 className="flex  gap-3.7 items-center font-unbounded font-extralight text-[60px] leading-none tracking-[-1.5px]">
                <span className="text-[#0b1514] dark:text-[#eaf6f3]">
                  {t('landing.security.titleWord1')}
                </span>
                <span className="text-[#00aa85]">
                  {t('landing.security.titleWord2')}
                </span>
              </h2>
              <p className="font-semibold text-[24px] leading-[1.167] tracking-[-1.5px] text-[#6f7e7c] dark:text-[#7f9e97] text-right">
                {t('landing.security.subtitle')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-11 gap-y-40">
            {security.map(item => (
              <SecurityItem key={item.number} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* footer*/}
      <footer className="relative h-39.5 overflow-hidden border-t border-[rgba(0,0,0,0.08)] dark:border-white/[0.14] backdrop-blur-md [box-shadow:0px_-4px_16px_0px_rgba(0,0,0,0.06)] dark:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.35),0px_4px_4px_0px_rgba(75,75,75,0.25)]">
        <div className="absolute inset-0 flex items-center justify-between px-13.75">
          {/* logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src={isDark ? darkLogo : logo}
              alt="Monity"
              className="h-9 w-auto"
            />
          </div>

          {/* copyright */}
          <div className="flex flex-col items-center gap-0.75">
            <p className="text-[16px] leading-[1.167] tracking-[-1.5px] text-[#0b1514] dark:text-[#eaf6f3]">
              Monity 2026
            </p>
            <p className="text-[10px] leading-[1.167] text-[#6f7e7c] dark:text-[#7f9e97]">
              {t('landing.footer.rights')}
            </p>
          </div>

          {/* contact */}
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
      </footer>
    </div>
  );
}

export default Landing;
