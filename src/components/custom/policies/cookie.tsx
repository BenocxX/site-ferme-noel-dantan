import { useTranslation } from 'react-i18next';

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
          <div className="mt-4 flex items-center gap-x-5">
            <button
              type="button"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              onClick={accept}
            >
              {t('cookieConsent.accept')}
            </button>
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={refuse}
            >
              {t('cookieConsent.refuse')}
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export function CookieRefusedForm() {
  const { t } = useTranslation('policies');
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl bg-white px-8 py-4 shadow">
      <h4 className="text-center text-3xl font-semibold">{t('cookieDisabled.title')}</h4>
      <p className="text-sm leading-6 text-gray-900">
        {t('cookieDisabled.description')}
        <a href="/policies" className="font-semibold text-indigo-600">
          {t('cookieConsent.privacyPolicy')}
        </a>
        .
      </p>
    </div>
  );
}
