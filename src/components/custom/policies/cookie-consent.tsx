import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

import { useCookieConsent } from '@/lib/hooks/useCookieConsent';

export function CookieConsent() {
  const { t } = useTranslation('policies');
  const { hasConsent, accept, refuse } = useCookieConsent();

  return (
    !hasConsent && (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6">
        <div className="pointer-events-auto ml-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
          <p className="text-sm leading-6 text-gray-900">
            {t('cookieConsent.text')}
            <a href="/policies" className="font-semibold text-indigo-600">
              {t('cookieConsent.privacyPolicy')}
            </a>
            .
          </p>
          <div className="mt-4 flex items-center gap-x-2">
            <Button onClick={accept} className="bg-gray-900 hover:bg-gray-700">
              {t('cookieConsent.accept')}
            </Button>
            <Button onClick={refuse} variant="ghost">
              {t('cookieConsent.refuse')}
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
