import { Helmet } from 'react-helmet';
import { Trans, useTranslation } from 'react-i18next';

import { createLazyFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

import { useCookieConsent } from '@/lib/hooks/useCookieConsent';

export const Route = createLazyFileRoute('/policies')({
  component: Policies,
});

function Policies() {
  const { t, i18n } = useTranslation('policies');
  const { accept, refuse, hasConsent, hasRefused, hasAccepted } = useCookieConsent();

  const sections = [
    { id: 1, title: t('sections.1.title'), description: t('sections.1.description') },
    { id: 2, title: t('sections.2.title'), description: t('sections.2.description') },
    { id: 3, title: t('sections.3.title'), description: t('sections.3.description') },
    { id: 4, title: t('sections.4.title'), description: t('sections.4.description') },
    {
      id: 5,
      title: t('sections.5.title'),
      description: (
        <Trans
          t={t}
          i18nKey="sections.5.description"
          components={{
            emailLink: <a className="text-primary underline-offset-4 hover:underline" />,
          }}
        />
      ),
    },
    {
      id: 6,
      title: t('sections.6.title'),
      description: (
        <Trans
          t={t}
          i18nKey="sections.6.description"
          components={{
            emailLink: <a className="text-primary underline-offset-4 hover:underline" />,
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title lang={i18n.language}>{t('metaTags.title')}</title>
        <meta name="description" content={t('metaTags.description')} />
        <meta property="og:title" content={t('metaTags.og:title')} />
        <meta property="og:description" content={t('metaTags.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.fermenoeldantan.ca/ferme-hiver.jpg" />
        <meta property="og:image:alt" content={t('heroSection.imageAlt', { ns: 'home' })} />
        <meta property="og:url" content="https://www.fermenoeldantan.ca/policies" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold leading-10 tracking-tight md:text-5xl">
              {t('title')}
            </h2>
          </div>
          <div className="mx-auto flex items-center justify-center">
            <p className="mt-8 text-center text-base leading-7 text-foreground/90">
              <Trans t={t} i18nKey="effectiveDate" />
            </p>
          </div>
          <p className="mx-auto mt-4 text-center text-base leading-7 text-foreground/60 md:max-w-[44rem] lg:max-w-[52rem]">
            <Trans t={t} i18nKey="subtitle" />
          </p>
          {hasConsent && (
            <div className="mt-8 flex justify-center">
              {hasRefused && (
                <Button onClick={accept} className="bg-gray-900 hover:bg-gray-700">
                  {t('cookieConsent.acceptPolicy')}
                </Button>
              )}
              {hasAccepted && (
                <Button onClick={refuse} className="bg-gray-900 hover:bg-gray-700">
                  {t('cookieConsent.refusePolicy')}
                </Button>
              )}
            </div>
          )}
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
              {sections.map((policy) => (
                <div key={policy.id}>
                  <dt className="text-base font-semibold leading-7">{policy.title}</dt>
                  <dd className="mt-2 text-base leading-7 text-foreground/60">
                    {policy.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
