import { TreePine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Link, createLazyFileRoute } from '@tanstack/react-router';

import FermeHiver from '@/assets/images/ferme-hiver.jpg';

import { SnowFaller } from '@/components/custom/snow-faller';
import { FacebookEmbeddedPage } from '@/components/custom/socials/FacebookEmbeddedPage';
import { buttonVariants } from '@/components/ui/button';

import useWindowDimensions from '@/lib/hooks/useWindowDimensions';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <section className="flex h-72 w-full items-center justify-center bg-primary">
        Seciton 2
      </section>
      <FacebookSection />
    </div>
  );
}

function HeroSection() {
  const { t } = useTranslation('home');

  return (
    <section className="relative h-[70vh] w-full overflow-hidden md:h-[80vh] lg:h-[90vh]">
      <img
        src={FermeHiver}
        alt="Ferme hiver"
        className="h-full w-full object-cover object-[80%_0%] blur-[2px] lg:object-[50%_100%]"
      />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full blur-[1px]">
        <SnowFaller />
      </div>
      <div className="absolute left-0 top-0 flex h-full w-full bg-black opacity-30"></div>
      <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center px-24 text-center text-white">
        <h1 className="h-max w-[500px] text-6xl md:text-6xl lg:text-7xl">
          {t('heroSection.title.line1')}
          <br />
          {t('heroSection.title.line2')}
          <br />
          {t('heroSection.title.line3')}
        </h1>
        <h4 className="mb-8 mt-4 text-wrap text-xl md:text-2xl">{t('heroSection.description')}</h4>
        <Link
          to="/reservation"
          className={buttonVariants({ size: 'lg', className: 'h-max gap-3 px-6 py-4 !text-lg' })}
        >
          {t('ctaButton')}
          <TreePine />
        </Link>
      </div>
    </section>
  );
}

function FacebookSection() {
  const { t } = useTranslation('home');

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <section className="flex w-full flex-col items-center gap-6 py-24">
      <div className="flex w-[400px] flex-col gap-2 text-center md:w-[500px]">
        <h3 className="text-3xl md:text-4xl">{t('facebookSection.title')}</h3>
        <p>{t('facebookSection.description')}</p>
      </div>
      <FacebookEmbeddedPage
        pageName="fermenoeldantan"
        width={isMobile ? 400 : 500}
        height={550}
        className="rounded"
      />
    </section>
  );
}
