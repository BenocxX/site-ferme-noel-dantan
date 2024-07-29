import React, { Suspense } from 'react';
import { Toaster } from 'sonner';

import { Outlet, createRootRoute } from '@tanstack/react-router';

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
      <div className="flex min-h-screen flex-col">
        <Navbar className="sticky top-0 z-50" />
        <main className="relativeflex flex-1 flex-col overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-right" />
        {/* <CookieConsent /> */}
      </div>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
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
