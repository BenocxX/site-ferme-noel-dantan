import { Namespaces } from '@/i18n/i18n';

export function getLinks(): {
  i18nKey: keyof Namespaces['navbar'];
  id?: string;
  offset?: number;
  href?: string;
  hideInNavbar?: boolean;
}[] {
  return [
    {
      i18nKey: 'reservation',
      href: '/',
    },
    {
      i18nKey: 'home',
      href: '/about',
    },
    {
      i18nKey: 'faq',
      href: '/faq',
    },
    {
      i18nKey: 'policies',
      href: '/policies',
      hideInNavbar: true,
    },
  ];
}

export function getSocial() {
  return {
    facebook: {
      href: 'https://www.facebook.com/fermenoeldantan',
    },
  };
}
