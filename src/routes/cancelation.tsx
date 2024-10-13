import axios, { AxiosError } from 'axios';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';

import AnimalHiver from '@/assets/images/animal-hiver.jpg';

import { SnowFaller } from '@/components/custom/snow-faller';
import { Button } from '@/components/ui/button';

const cancelationSearch = z.object({
  hash: z.string().catch(''),
});

export const Route = createFileRoute('/cancelation')({
  validateSearch: cancelationSearch,
  beforeLoad: async ({ search: { hash } }) => {
    try {
      await axios.get('/api/cancel-reservation', { params: { hash } });
    } catch (error) {
      throw redirect({ to: '/', from: '/cancelation' });
    }
  },
  component: CancelationPage,
});

function CancelationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hash } = Route.useSearch();

  const mutation = useMutation({
    mutationFn: () => axios.post('/api/cancel-reservation', { hash }),
    onSuccess: async () => {
      await navigate({
        from: '/cancelation',
        to: '/',
      });
    },
  });

  function onCancelClick() {
    const promise = mutation.mutateAsync();

    toast.promise(promise, {
      loading: 'Cancellation en cours...',
      success: 'Cancellation réussie',
      error: (error: AxiosError) => {
        const result = error.response?.data as { error: string } | undefined;

        switch (result?.error) {
          case 'reservationNotFound':
            return t('errors.reservationNotFound', { ns: 'reservation' });
        }

        return t('errors.unknownError', { ns: 'reservation' });
      },
    });
  }

  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pr-8 lg:pt-48 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Annulation de réservation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Vous vous apprêtez à annuler votre réservation. Êtes-vous sûr de vouloir continuer?
              Une fois la réservation annulée, d'autres clients pourront prendre votre place.
              Cependant, rien ne vous empêche de réserver à nouveau!
            </p>
            <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-4 sm:flex-row">
              <Button onClick={onCancelClick} className="w-full gap-2 px-6 sm:w-max">
                Annuler ma réservation
                <TriangleAlert className="h-5" />
              </Button>
              <Button asChild variant="ghost" className="w-full sm:w-max">
                <Link to="/about">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <img
            alt="Animal en hiver"
            src={AnimalHiver}
            className="aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
          />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-y-hidden blur-[1px]">
            <SnowFaller length={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
