import { useTranslation } from 'react-i18next';

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
    <div className="container my-16 flex h-[80vh] w-screen items-center justify-center">
      <div className="relative h-full flex-1 overflow-y-hidden">
        <img
          className="h-full rounded-xl object-cover shadow"
          src={FamilleAnimal}
          alt="Famille avec gros animal"
        />
        <div className="absolute left-0 top-0 h-full w-full rounded-xl">
          <SnowFaller />
        </div>
      </div>
      <div className="flex h-full flex-1 flex-col px-8 py-4">
        <h1 className="mb-4 text-5xl">{t('title')}</h1>
        <p className="mb-8 text-muted-foreground">{t('information')}</p>
        <ReservationForm className="flex-1 space-y-4" />
      </div>
    </div>
  );
}
