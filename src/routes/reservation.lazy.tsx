import { Trans, useTranslation } from 'react-i18next';

import { createLazyFileRoute } from '@tanstack/react-router';

import FamilleAnimal from '@/assets/images/famille-animal-hiver.jpg';

import { ReservationForm } from '@/components/custom/forms/reservation-form';
import { SnowFaller } from '@/components/custom/snow-faller';

export const Route = createLazyFileRoute('/reservation')({
  component: Reservation,
});

function Reservation() {
  const { t } = useTranslation('reservation');

  return (
    <div className="flex w-screen flex-col items-center justify-center lg:container lg:my-16 lg:h-[80vh] lg:flex-row">
      <div className="relative w-full flex-1 overflow-hidden lg:h-full">
        <img
          className="h-[25vh] w-full object-cover object-[50%_70%] shadow sm:h-[30vh] md:h-[35vh] lg:h-full lg:rounded-xl"
          src={FamilleAnimal}
          alt="Famille avec gros animal"
        />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-xl">
          <SnowFaller />
        </div>
      </div>
      <div className="flex h-full flex-1 flex-col px-8 py-4 max-lg:my-4 lg:min-w-[800px]">
        <h1 className="mb-6 text-center text-5xl lg:mb-4 lg:text-left">{t('title')}</h1>
        <p className="mb-12 text-center text-muted-foreground lg:mb-8 lg:text-left">
          {/* Ref: https://react.i18next.com/latest/trans-component#alternative-usage-which-lists-the-components-v11.6.0 */}
          <Trans
            t={t}
            i18nKey="information"
            components={{
              phoneLink: <a className="text-primary" />,
            }}
          />
        </p>
        <ReservationForm className="flex-1 space-y-4" />
      </div>
    </div>
  );
}
