import { buttonVariants } from '../../ui/button';
import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

import { getLinks, getSocial } from '@/lib/links';
import { cn } from '@/lib/utils';

export function Footer({ hideLinks = false }: { hideLinks?: boolean }) {
  const { t } = useTranslation('footer');

  const links = getLinks();
  const socials = getSocial();

  const iconButton = buttonVariants({
    variant: 'ghost',
    size: 'icon',
    className: 'aspect-square fill-secondary-foreground/50 w-max group',
  });

  return (
    <footer className="flex flex-col items-center justify-center gap-6 bg-secondary px-8 py-16 text-secondary-foreground">
      <nav
        aria-label="Footer"
        className={cn(
          '-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12',
          hideLinks && 'hidden'
        )}
      >
        {links.map((link, i) => (
          <div key={i} className="pb-6">
            <Link
              to={link.href}
              className="text-sm leading-6 text-gray-600 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {t(link.i18nKey, { ns: 'navbar' })}
            </Link>
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-8">
        {socials.facebook.href !== '#' && (
          <a href={socials.facebook.href} className={iconButton}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-secondary-foreground/50 transition-colors group-hover:fill-secondary-foreground"
            >
              <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
            </svg>
          </a>
        )}
      </div>
      <div className="text-center text-sm opacity-50">{t('copyright')}</div>
    </footer>
  );
}
