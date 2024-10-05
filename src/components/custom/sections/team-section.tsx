import { TreePine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

import Equipe1 from '@/assets/images/equipe-1.jpg';
import Equipe2 from '@/assets/images/equipe-2.jpg';
import Equipe3 from '@/assets/images/equipe-3.jpg';
import Equipe4 from '@/assets/images/equipe-4.jpg';

import { Button } from '@/components/ui/button';

export function TeamSection() {
  const { t } = useTranslation('home');

  return (
    <div className="overflow-hidden py-32">
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <h2 className="text-base font-semibold leading-7 text-primary">
              {t('teamSection.subTitle')}
            </h2>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t('teamSection.title')}
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">{t('teamSection.description')}</p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              {t('teamSection.subDescription')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/reservation">
                  {t('ctaButton')}
                  <TreePine className="h-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col flex-wrap items-start justify-end gap-6 sm:gap-8 md:flex-row lg:contents">
            <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
              <img
                alt=""
                src={Equipe1}
                className="aspect-[7/5] w-screen max-w-none rounded-2xl bg-gray-50 object-cover md:w-[37rem]"
              />
            </div>
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
              <div className="order-first hidden w-64 flex-none justify-end self-end md:flex lg:w-auto">
                <img
                  alt=""
                  src={Equipe3}
                  className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover object-[100%_0%]"
                />
              </div>
              <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                <img
                  alt=""
                  src={Equipe2}
                  className="aspect-[7/5] w-screen max-w-none flex-none rounded-2xl bg-gray-50 object-cover md:w-[37rem]"
                />
              </div>
              <div className="hidden sm:w-0 sm:flex-auto md:block lg:w-auto lg:flex-none">
                <img
                  alt=""
                  src={Equipe4}
                  className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
