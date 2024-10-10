import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/reservez-votre-autocueillette-de-sapin-de-noel')({
  beforeLoad: () => {
    throw redirect({
      to: '/',
    });
  },
  loader: () => {
    throw redirect({
      to: '/',
    });
  },
});
