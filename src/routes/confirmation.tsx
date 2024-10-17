/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import { VariantProps } from 'class-variance-authority';
import { formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  Home,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';

import AnimalHiver from '@/assets/images/animal-hiver.jpg';

import { SnowFaller } from '@/components/custom/snow-faller';
import { Alert, AlertDescription, AlertTitle, alertVariants } from '@/components/ui/alert';
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

import { cn } from '@/lib/utils';

const confirmationSearch = z.object({
  hash: z.string().catch(''),
  email: z.string().catch(''),
  date: z.coerce.date().catch(new Date()),
  time: z.string().catch(''),
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
  const { hash, email, date, time } = Route.useSearch();

  const [emailAlert, setEmailAlert] = useState<{
    variant: VariantProps<typeof alertVariants>['variant'];
    icon: React.ReactElement;
    title: any;
    description: any;
    showButton: boolean;
  }>({
    variant: 'default',
    icon: <CircleEllipsis className="!top-1/2 h-8 w-8 !-translate-y-1/2" />,
    title: 'onEmail.loading.title',
    description: 'onEmail.loading.description',
    showButton: false,
  });

  const formattedDate = formatDate(date, 'PPPP', {
    locale: i18n.language === 'fr' ? frCA : undefined,
  });

  const emailMutation = useMutation({
    mutationFn: ({ resend }: { resend: boolean }) => {
      return axios.post<{ message: string }>('/api/confirmation-email', {
        hash,
        email,
        date: formattedDate,
        time,
        rawDate: date,
        language: i18n.language,
        resend,
      });
    },
    onSuccess: async (data) => {
      switch (data.data.message) {
        case 'emailSent':
          setEmailAlert({
            variant: 'success',
            icon: <CircleCheck className="!top-1/2 h-8 w-8 !-translate-y-1/2" />,
            title: 'onEmail.success.title',
            description: 'onEmail.success.description',
            showButton: false,
          });
          break;
        case 'emailAlreadySent':
          setEmailAlert({
            variant: 'info',
            icon: <CircleAlert className="!top-1/2 h-8 w-8 !-translate-y-1/2" />,
            title: 'onEmail.alreadySent.title',
            description: 'onEmail.alreadySent.description',
            showButton: true,
          });
          break;
      }
    },
    onError: () => {
      setEmailAlert({
        variant: 'destructive',
        icon: <CircleX className="!top-1/2 h-8 w-8 !-translate-y-1/2" />,
        title: 'onEmail.emailError.title',
        description: 'onEmail.emailError.description',
        showButton: true,
      });
    },
  });

  useEffect(() => {
    emailMutation.mutateAsync({ resend: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutation = useMutation({
    mutationFn: () => axios.post('/api/cancel-reservation', { hash }),
    onSuccess: async () => {
      await navigate({
        from: '/confirmation',
        to: '/',
      });
    },
  });

  function onResendEmailClick() {
    setEmailAlert({
      variant: 'default',
      icon: <CircleEllipsis className="mt-1.5 h-8 w-8" />,
      title: 'onEmail.loading.title',
      description: 'onEmail.loading.description',
      showButton: false,
    });

    emailMutation.mutateAsync({ resend: true });
  }

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
            <Alert variant={emailAlert.variant} className="mb-0 mt-6">
              {emailAlert.icon}
              <AlertTitle className={cn('ml-4 mt-1', emailAlert.showButton && 'pr-24')}>
                {t(emailAlert.title)}
              </AlertTitle>
              <AlertDescription className={cn('ml-4', emailAlert.showButton && 'pr-24')}>
                {t(emailAlert.description)}
              </AlertDescription>
              {emailAlert.showButton && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-black/5"
                    onClick={onResendEmailClick}
                  >
                    {t('onEmail.sendAgain')}
                  </Button>
                </div>
              )}
            </Alert>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              <Trans
                t={t}
                i18nKey="description"
                values={{
                  date: formattedDate,
                  time,
                  email,
                }}
                components={{
                  date: <strong className="font-semibold text-gray-900" />,
                  time: <strong className="font-semibold text-gray-900" />,
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
