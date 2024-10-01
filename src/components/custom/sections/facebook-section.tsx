import { FacebookEmbeddedPage } from '../socials/FacebookEmbeddedPage';
import { useTranslation } from 'react-i18next';

import useWindowDimensions from '@/lib/hooks/useWindowDimensions';

export function FacebookSection() {
  const { t } = useTranslation('home');

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <section className="flex w-full flex-col items-center gap-6 py-24">
      <div className="flex w-[350px] flex-col gap-2 text-center md:w-[500px]">
        <h3 className="text-3xl md:text-4xl">{t('facebookSection.title')}</h3>
        <p>{t('facebookSection.description')}</p>
      </div>
      <FacebookEmbeddedPage
        pageName="fermenoeldantan"
        width={isMobile ? 350 : 500}
        height={550}
        className="rounded"
      />
    </section>
  );
}
