import { z } from 'zod';

import { createFileRoute } from '@tanstack/react-router';

const confirmationSearch = z.object({
  hash: z.string().catch(''),
  email: z.string().catch(''),
});

type ConfirmationSearch = z.infer<typeof confirmationSearch>;

export const Route = createFileRoute('/confirmation')({
  validateSearch: confirmationSearch,
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { hash, email } = Route.useSearch();

  console.log(hash, email);

  return <div className="flex flex-1 items-center justify-center">hello</div>;
}
