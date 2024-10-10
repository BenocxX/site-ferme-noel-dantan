import { TriangleAlert } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Trans, useTranslation } from 'react-i18next';

import { createLazyFileRoute } from '@tanstack/react-router';

import FamilleAnimal from '@/assets/images/famille-animal-hiver.jpg';

// import { ReservationForm } from '@/components/custom/forms/reservation-form';
import { SnowFaller } from '@/components/custom/snow-faller';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const Route = createLazyFileRoute('/')({
  component: Reservation,
});

function Reservation() {
  const { t, i18n } = useTranslation('reservation');

  return (
    <>
      <Helmet>
        <title lang={i18n.language}>{t('metaTags.title')}</title>
        <meta name="description" content={t('metaTags.description')} />
        <meta property="og:title" content={t('metaTags.og:title')} />
        <meta property="og:description" content={t('metaTags.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.fermenoeldantan.ca/sentier-hiver.jpg" />
        <meta property="og:image:alt" content={t('offerSection.imageAlt', { ns: 'home' })} />
        <meta property="og:url" content="https://www.fermenoeldantan.ca/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="bg-secondary">
        <div className="flex w-screen flex-col items-center justify-center lg:container lg:h-[80vh] lg:flex-row lg:py-16">
          <div className="relative w-full flex-1 overflow-hidden lg:h-full">
            <img
              className="h-[25vh] w-full object-cover object-[50%_70%] shadow sm:h-[30vh] md:h-[35vh] lg:h-full lg:rounded-xl"
              src={FamilleAnimal}
              alt={t('imageAlt')}
            />
            <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-xl">
              <SnowFaller />
            </div>
          </div>
          <div className="flex h-full flex-1 flex-col px-8 py-4 max-lg:my-4 lg:min-w-[800px]">
            <h1 className="mb-6 text-center text-5xl lg:mb-4 lg:text-left">{t('title')}</h1>
            <p className="mb-4 text-center text-muted-foreground lg:text-left">
              {/* Ref: https://react.i18next.com/latest/trans-component#alternative-usage-which-lists-the-components-v11.6.0 */}
              <Trans
                t={t}
                i18nKey="information"
                components={{
                  phoneLink: <a className="text-primary" />,
                }}
              />
            </p>
            <Alert variant="warning" className="mb-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>{t('rulesAlert.title')}</AlertTitle>
              <AlertDescription>{t('rulesAlert.content')}</AlertDescription>
            </Alert>
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl bg-white px-8 py-4 shadow">
              <h4 className="text-center text-3xl font-semibold">{t('tempDisabled.title')}</h4>
              <p className="text-center">{t('tempDisabled.description')}</p>
            </div>
            {/* <ReservationForm /> */}
          </div>
        </div>
      </div>
    </>
  );
}
