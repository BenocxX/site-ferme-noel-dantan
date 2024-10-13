import { Home, TriangleAlert } from 'lucide-react';
import { z } from 'zod';

import { Link, createFileRoute } from '@tanstack/react-router';

import AnimalHiver from '@/assets/images/animal-hiver.jpg';

import { SnowFaller } from '@/components/custom/snow-faller';
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
});

export const Route = createFileRoute('/confirmation')({
  validateSearch: confirmationSearch,
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { hash, email } = Route.useSearch();

  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pr-8 lg:pt-48 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Merci et à bientôt!
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Votre réservation a été soumise avec succès. Vous devriez recevoir un email de
              confirmation à l'adresse <span className="font-semibold text-gray-900">{email}</span>.
              Au plaisir de vous voir bientôt!
            </p>
            <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-4 sm:flex-row">
              <Button asChild className="w-full gap-2 px-6 sm:w-max">
                <Link to="/about">
                  Retour à l'accueil <Home className="h-5" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="w-full sm:w-max">
                    Annuler ma réservation
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous sûr de vouloir annuler votre réservation?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Une fois annulée, d'autres clients pourront prendre votre place. Cependant,
                      rien ne vous empêche de réserver à nouveau!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Retour</AlertDialogCancel>
                    <AlertDialogAction className="gap-2">
                      Confirmer l'annulation
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
