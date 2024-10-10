import { TreePine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

import SentierHiver from '@/assets/images/sentier-hiver.jpg';

import { Button } from '@/components/ui/button';

export function OfferSection() {
  const { t } = useTranslation('home');

  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-primary">
                {t('offerSection.subTitle')}
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('offerSection.title')}
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {t('offerSection.description')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/">
                    {t('ctaButton')}
                    <TreePine className="h-5" />
                  </Link>
                </Button>
              </div>
              <figure className="mt-16 border-l border-gray-200 pl-8 text-gray-600">
                <blockquote className="text-base leading-7">
                  <p>“{t('offerSection.quote.text')}”</p>
                </blockquote>
                <figcaption className="mt-6 flex gap-x-4 text-sm leading-6">
                  {/* <img
                    alt=""
                    src="https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-6/275421468_1572442069801405_6302698686172045318_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=7cASifAZNmcQ7kNvgFts1-v&_nc_ht=scontent-lga3-2.xx&oh=00_AYBKVQR65cNYrHv9d5g0nd-1VGfcfJOGEkOI8FhhPV8f1g&oe=6701EBCC"
                    className="h-6 w-6 flex-none rounded-full object-cover"
                  /> */}
                  <div>
                    - <span className="font-semibold">{t('offerSection.quote.person')}</span>
                    {/* <span className="font-semibold">{t('offerSection.quote.person')}</span> -{' '}
                    {t('offerSection.quote.job')} */}
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <img
              alt={t('offerSection.imageAlt')}
              src={SentierHiver}
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
