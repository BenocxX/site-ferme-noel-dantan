import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { createLazyFileRoute } from '@tanstack/react-router';

import { ContactSection } from '@/components/custom/sections/contact-section';
import { HeroSection } from '@/components/custom/sections/hero-section';
import { OfferSection } from '@/components/custom/sections/offer-section';
import { TeamSection } from '@/components/custom/sections/team-section';

export const Route = createLazyFileRoute('/about')({
  component: Index,
});

function Index() {
  const { t, i18n } = useTranslation('home');

  return (
    <>
      <Helmet>
        <title lang={i18n.language}>{t('metaTags.title')}</title>
        <meta name="description" content={t('metaTags.description')} />
        <meta property="og:title" content={t('metaTags.og:title')} />
        <meta property="og:description" content={t('metaTags.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.fermenoeldantan.ca/ferme-hiver.jpg" />
        <meta property="og:image:alt" content={t('heroSection.imageAlt')} />
        <meta property="og:url" content="https://www.fermenoeldantan.ca/about" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="flex flex-col">
        <HeroSection />
        <OfferSection />
        <TeamSection />
        <ContactSection />
      </div>
    </>
  );
}
