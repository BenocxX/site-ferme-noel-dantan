import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/politique-de-cookies-ca')({
  beforeLoad: () => {
    throw redirect({
      to: '/policies',
    });
  },
  loader: () => {
    throw redirect({
      to: '/policies',
    });
  },
});
