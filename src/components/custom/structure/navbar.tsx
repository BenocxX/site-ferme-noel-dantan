import { Menu } from "lucide-react";
import { LanguageSwitcher } from "../language-switcher";
import { buttonVariants } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { Close as SheetClose } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { Separator } from "../../ui/separator";
import { Link } from "@tanstack/react-router";
import { Footer } from "./footer";
import { resources } from "@/i18n/i18n";
import { cn } from "@/lib/utils";

const links: {
  i18nKey: keyof (typeof resources)["en"]["navbar"];
  id?: string;
  offset?: number;
  href?: string;
}[] = [
  {
    i18nKey: "reservation",
    href: "/reservation",
  },
];

function NavbarSheet() {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger
        className={buttonVariants({
          variant: "ghost",
          size: "icon",
          className: "md:hidden",
        })}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <SheetHeader className="flex flex-col gap-2">
          <SheetTitle className="text-3xl font-medium">
            {t("companyName")}
          </SheetTitle>
          <Separator />
          <div className="flex flex-col">
            {links.map((link, i) => (
              <SheetClose key={i} asChild>
                <Link
                  key={i}
                  to={link.href}
                  search={{ id: link.id, offset: link.offset }}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "!justify-start",
                  })}
                >
                  {t(link.i18nKey, { ns: "navbar" })}
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

export function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation();

  return (
    <nav
      className={cn(
        "flex w-screen items-center justify-between bg-primary text-white bg-opacity-75 shadow-sm backdrop-blur gap-6 py-4 md:py-6 px-4 md:px-8 md:flex lg:gap-12",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <NavbarSheet />
        <h4 className="text-2xl md:text-3xl font-medium">{t("companyName")}</h4>
        <div className="px-4 hidden md:flex items-center">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              search={{ id: link.id, offset: link.offset }}
              className={buttonVariants({
                variant: "link",
                className: "text-base text-white font-normal",
              })}
            >
              {t(link.i18nKey, { ns: "navbar" })}
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
