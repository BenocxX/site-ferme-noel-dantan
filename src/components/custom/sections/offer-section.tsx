import { TreePine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

import SentierHiver from '@/assets/images/sentier-hiver.jpg';

import { Button } from '@/components/ui/button';

export function OfferSection() {
  const { t } = useTranslation('home');

  return (
    <div className="overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
          <div className="lg:pr-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Une grande sélection
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Des centaines de sapins
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Venez vous promener dans notre forêt de sapins et choisissez le vôtre parmi des
                centaines d&apos;arbres.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/reservation">
                    {t('ctaButton')}
                    <TreePine className="h-5" />
                  </Link>
                </Button>
              </div>
              <figure className="mt-16 border-l border-gray-200 pl-8 text-gray-600">
                <blockquote className="text-base leading-7">
                  <p>
                    “Vel ultricies morbi odio facilisi ultrices accumsan donec lacus purus. Lectus
                    nibh ullamcorper ac dictum justo in euismod. Risus aenean ut elit massa. In amet
                    aliquet eget cras. Sem volutpat enim tristique.”
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex gap-x-4 text-sm leading-6">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                    className="h-6 w-6 flex-none rounded-full"
                  />
                  <div>
                    <span className="font-semibold">Maria Hill</span> - Marketing Manager
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
          <img
            alt="Sentier hiver"
            src={SentierHiver}
            width={2432}
            height={1442}
            className="max-h-[500px] w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:ml-0"
          />
        </div>
      </div>
    </div>
  );
}
