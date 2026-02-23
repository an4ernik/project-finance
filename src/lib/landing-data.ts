import type {TFunction} from 'i18next';

export function getFeatures(t: TFunction) {
  return [
    {
      number: '01',
      title: t('landing.about.f1Title'),
      description: t('landing.about.f1Desc'),
    },
    {
      number: '02',
      title: t('landing.about.f2Title'),
      description: t('landing.about.f2Desc'),
    },
    {
      number: '03',
      title: t('landing.about.f3Title'),
      description: t('landing.about.f3Desc'),
    },
    {
      number: '04',
      title: t('landing.about.f4Title'),
      description: t('landing.about.f4Desc'),
    },
  ];
}

export function getSteps(t: TFunction) {
  return [
    {
      number: '01',
      title: t('landing.howItWorks.s1Title'),
      description: t('landing.howItWorks.s1Desc'),
      accent: true,
    },
    {
      number: '02',
      title: t('landing.howItWorks.s2Title'),
      description: t('landing.howItWorks.s2Desc'),
    },
    {
      number: '03',
      title: t('landing.howItWorks.s3Title'),
      description: t('landing.howItWorks.s3Desc'),
    },
    {
      number: '04',
      title: t('landing.howItWorks.s4Title'),
      description: t('landing.howItWorks.s4Desc'),
    },
    {
      number: '05',
      title: t('landing.howItWorks.s5Title'),
      description: t('landing.howItWorks.s5Desc'),
    },
  ];
}

export function getSecurity(t: TFunction) {
  return [
    {
      number: '01',
      title: t('landing.security.i1Title'),
      description: t('landing.security.i1Desc'),
    },
    {
      number: '02',
      title: t('landing.security.i2Title'),
      description: t('landing.security.i2Desc'),
    },
    {
      number: '03',
      title: t('landing.security.i3Title'),
      description: t('landing.security.i3Desc'),
    },
    {
      number: '04',
      title: t('landing.security.i4Title'),
      description: t('landing.security.i4Desc'),
    },
  ];
}
