import { buttonVariants } from '../../ui/button';
import { Separator } from '../../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/sheet';
import { LanguageSwitcher } from '../language-switcher';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Close as SheetClose } from '@radix-ui/react-dialog';
import { Link } from '@tanstack/react-router';

import { Namespaces } from '@/i18n/i18n';
import { cn } from '@/lib/utils';

import { Footer } from './footer';

const links: {
  i18nKey: keyof Namespaces['navbar'];
  id?: string;
  offset?: number;
  href?: string;
}[] = [
  {
    i18nKey: 'home',
    href: '/',
  },
  {
    i18nKey: 'reservation',
    href: '/reservation',
  },
  {
    i18nKey: 'faq',
    href: '/faq',
  },
];

function NavbarSheet() {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger
        className={buttonVariants({
          variant: 'ghost',
          size: 'icon',
          className: 'md:hidden',
        })}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <SheetHeader className="flex flex-col gap-2 p-6">
          <SheetTitle className="text-3xl font-medium">{t('companyName')}</SheetTitle>
          <Separator />
          <div className="flex flex-col">
            {links.map((link, i) => (
              <SheetClose key={i} asChild>
                <Link
                  key={i}
                  to={link.href}
                  search={{ id: link.id, offset: link.offset }}
                  className={buttonVariants({
                    variant: 'ghost',
                    className: '!justify-start',
                  })}
                >
                  {t(link.i18nKey, { ns: 'navbar' })}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetHeader>
        <SheetFooter className="mt-auto">
          <Footer />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation();

  return (
    <nav
      className={cn(
        'flex w-screen items-center justify-between gap-6 bg-primary bg-opacity-75 px-4 py-4 text-white shadow-sm backdrop-blur md:flex md:px-8 md:py-6 lg:gap-12',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <NavbarSheet />
        <h4 className="text-2xl font-medium md:text-3xl">{t('companyName')}</h4>
        <div className="hidden items-center pl-6 md:flex">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              search={{ id: link.id, offset: link.offset }}
              className={buttonVariants({
                variant: 'link',
                className: '!text-base font-normal text-white',
              })}
            >
              {t(link.i18nKey, { ns: 'navbar' })}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
