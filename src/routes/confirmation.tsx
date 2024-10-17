import axios, { AxiosError } from 'axios';
import { formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import { CircleAlert, Home, TriangleAlert } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';

import AnimalHiver from '@/assets/images/animal-hiver.jpg';

import { SnowFaller } from '@/components/custom/snow-faller';
import { Alert, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const confirmationSearch = z.object({
  hash: z.string().catch(''),
  email: z.string().catch(''),
  date: z.coerce.date().catch(new Date()),
});

export const Route = createFileRoute('/confirmation')({
  validateSearch: confirmationSearch,
  beforeLoad: async ({ search: { hash } }) => {
    try {
      await axios.get('/api/cancel-reservation', { params: { hash } });
    } catch (error) {
      throw redirect({ to: '/', from: '/confirmation' });
    }
  },
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { t, i18n } = useTranslation('confirmation');
  const navigate = useNavigate();
  const { hash, email, date } = Route.useSearch();

  const formattedDate = formatDate(date, 'PPPP', {
    locale: i18n.language === 'fr' ? frCA : undefined,
  });

  // eslint-disable-next-line quotes
  // const formattedTime = formatDate(date, "H'h'mm", {
  //   locale: i18n.language === 'fr' ? frCA : undefined,
  // });

  const mutation = useMutation({
    mutationFn: () => axios.post('/api/cancel-reservation', { hash }),
    onSuccess: async () => {
      await navigate({
        from: '/confirmation',
        to: '/',
      });
    },
  });

  function onCancelClick() {
    const promise = mutation.mutateAsync();

    toast.promise(promise, {
      loading: t('onCancelation.loading'),
      success: t('onCancelation.success'),
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
              {t('title')}
            </h1>
            <Alert variant="info" className="mb-0 mt-6">
              <CircleAlert className="h-6 w-6" />
              <AlertTitle className="ml-2 mt-1">{t('emailAlert')}</AlertTitle>
            </Alert>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              <Trans
                t={t}
                i18nKey="description"
                values={{
                  date: formattedDate,
                  // time: formattedTime,
                  email,
                }}
                components={{
                  date: <strong className="font-semibold text-gray-900" />,
                  // time: <strong className="font-semibold text-gray-900" />,
                  email: <strong className="font-semibold text-gray-900" />,
                }}
              />
            </p>
            <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-4 sm:flex-row">
              <Button asChild className="w-full gap-2 px-6 sm:w-max">
                <Link to="/about">
                  {t('buttons.home')} <Home className="h-5" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="w-full sm:w-max">
                    {t('buttons.cancel')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('alert.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('alert.description')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('alert.buttons.back')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onCancelClick} className="gap-2">
                      {t('alert.buttons.confirm')}
                      <TriangleAlert className="h-5" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <img
            alt={t('imageAlt')}
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
