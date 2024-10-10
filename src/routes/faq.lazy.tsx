import { Helmet } from 'react-helmet';
import { Trans, useTranslation } from 'react-i18next';

import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/faq')({
  component: Faq,
});

function Faq() {
  const { t, i18n } = useTranslation('faq');

  const faqs = [
    { id: 1, question: t('questions.1.question'), answer: t('questions.1.answer') },
    { id: 2, question: t('questions.2.question'), answer: t('questions.2.answer') },
    { id: 3, question: t('questions.3.question'), answer: t('questions.3.answer') },
    { id: 4, question: t('questions.4.question'), answer: t('questions.4.answer') },
    { id: 5, question: t('questions.5.question'), answer: t('questions.5.answer') },
    { id: 6, question: t('questions.6.question'), answer: t('questions.6.answer') },
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
        <meta property="og:url" content="https://www.fermenoeldantan.ca/faq" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold leading-10 tracking-tight md:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-8 text-base leading-7 text-foreground/60">
              <Trans
                t={t}
                i18nKey="subtitle"
                components={{
                  phoneLink: <a className="text-primary underline-offset-4 hover:underline" />,
                }}
              />
            </p>
          </div>
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt className="text-base font-semibold leading-7">{faq.question}</dt>
                  <dd className="mt-2 text-base leading-7 text-foreground/60">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
