import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/faq')({
  component: Faq,
});

function Faq() {
  return (
    <div>
      <h1>Faq</h1>
    </div>
  );
}
