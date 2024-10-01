import { FacebookEmbeddedPage } from '../socials/FacebookEmbeddedPage';
import { TreePine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

import useWindowDimensions from '@/lib/hooks/useWindowDimensions';

export function ContactSection() {
  const { t } = useTranslation('home');

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2">
          <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <h2 className="text-base font-semibold leading-7 text-primary">
              {t('contactSection.subTitle')}
            </h2>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('contactSection.title')}
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              {t('contactSection.description')}
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              {t('contactSection.subDescription')}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/reservation">
                  {t('ctaButton')}
                  <TreePine className="h-5" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg">
                <a href="https://www.facebook.com/fermenoeldantan">{t('contactSection.link')}</a>
              </Button>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0">
            <FacebookEmbeddedPage
              pageName="fermenoeldantan"
              width={isMobile ? 375 : 500}
              height={550}
              className="mx-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
