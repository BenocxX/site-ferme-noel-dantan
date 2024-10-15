import { Button, buttonVariants } from '../../ui/button';
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
import { Link, useLocation } from '@tanstack/react-router';

import { getLinks } from '@/lib/links';
import { cn } from '@/lib/utils';

import { Footer } from './footer';

const links = getLinks();

function NavbarSheet() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

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
                <Button
                  asChild
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  className="!justify-start"
                >
                  <Link to={link.href}>{t(link.i18nKey, { ns: 'navbar' })}</Link>
                </Button>
              </SheetClose>
            ))}
          </div>
        </SheetHeader>
        <SheetFooter className="mt-auto">
          <Footer hideLinks />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

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
          {links
            .filter((link) => !link.hideInNavbar)
            .map((link, i) => (
              <Button
                key={i}
                asChild
                variant="link"
                className={cn(
                  '!text-base font-normal text-white',
                  pathname === link.href ? 'underline' : ''
                )}
              >
                <Link to={link.href}>{t(link.i18nKey, { ns: 'navbar' })}</Link>
              </Button>
            ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
