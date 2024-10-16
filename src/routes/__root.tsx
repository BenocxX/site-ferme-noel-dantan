import React, { Suspense } from 'react';
import { Toaster } from 'sonner';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import { CookieConsent } from '@/components/custom/policies/cookie-consent';
import { Footer } from '@/components/custom/structure/footer';
import { Navbar } from '@/components/custom/structure/navbar';

import { useI18nPersistence } from '@/lib/hooks/useI18nPersistence';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { useLanguageEffect } = useI18nPersistence();
  useLanguageEffect();

  return (
    <>
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        <Navbar className="sticky top-0 z-50" />
        <main className="relative flex flex-1 flex-col overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-right" richColors closeButton className="toast" />
        {<CookieConsent />}
      </div>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
      <ReactQueryDevtools />
    </>
  );
}

// Only render the devtools in development
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );
