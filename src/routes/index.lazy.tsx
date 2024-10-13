import { TriangleAlert } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Trans, useTranslation } from 'react-i18next';

import { Link, createLazyFileRoute } from '@tanstack/react-router';

import FamilleAnimal from '@/assets/images/famille-animal-hiver.jpg';

import { ReservationForm } from '@/components/custom/forms/reservation-form';
import { SnowFaller } from '@/components/custom/snow-faller';
import { GoogleEmbeddedMap } from '@/components/custom/socials/GoogleEmbeddedMap';
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
                  faqLink: (
                    <Link to="/faq" className="text-primary underline-offset-4 hover:underline" />
                  ),
                  phoneLink: <a className="text-primary underline-offset-4 hover:underline" />,
                }}
              />
            </p>
            <Alert variant="warning" className="mb-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>{t('rulesAlert.title')}</AlertTitle>
              <AlertDescription>{t('rulesAlert.content')}</AlertDescription>
            </Alert>
            {/* To disable the reservation system, uncomment the following block: */}
            {/* <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl bg-white px-8 py-4 shadow">
              <h4 className="text-center text-3xl font-semibold">{t('tempDisabled.title')}</h4>
              <p className="text-center">{t('tempDisabled.description')}</p>
            </div> */}
            <ReservationForm />
          </div>
        </div>
      </div>
      <div className="bg-secondary">
        <div className="container mx-auto py-8 lg:py-0">
          <h2 className="text-center text-4xl sm:text-left">{t('whereSection.title')}</h2>
          <p className="mb-4 mt-2 text-center text-muted-foreground sm:text-left">
            <Trans
              t={t}
              i18nKey="whereSection.description"
              components={{
                addressLink: (
                  <a
                    className="text-primary underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.google.com/maps/place/Autocueillette+de+sapin+-+Ferme+No%C3%ABl+d+antan/@45.6882866,-72.6570754,14.29z/data=!4m6!3m5!1s0x4cc839f3eb53d541:0xe5fb58d9e9b4e82f!8m2!3d45.6843166!4d-72.6382783!16s%2Fg%2F11ql_3nk4h?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D"
                  />
                ),
              }}
            />
          </p>
          <GoogleEmbeddedMap className="h-[50vh] w-full rounded-xl shadow md:h-[75vh]" />
        </div>
      </div>
    </>
  );
}
