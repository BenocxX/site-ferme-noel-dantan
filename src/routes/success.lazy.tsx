import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/success')({
  component: () => <div>Hello /success!</div>,
});
