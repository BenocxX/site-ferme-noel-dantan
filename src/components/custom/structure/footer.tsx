import { buttonVariants } from "../../ui/button";
import { useTranslation } from "react-i18next";
import { getLinks } from "@/lib/links";

export function Footer() {
  const { t } = useTranslation();

  const links = getLinks();

  const iconButton = buttonVariants({ variant: "ghost", size: "icon" });

  return (
    <footer className="flex flex-col items-center justify-center gap-6 px-8 pb-10 pt-32">
      <div className="flex items-center gap-8">
        {links.facebook.href !== "#" && (
          <a href={links.facebook.href} className={iconButton}>
            <svg
              fill="#000000"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
            </svg>
          </a>
        )}
        {links.linkedin.href !== "#" && (
          <a href={links.linkedin.href} className={iconButton}>
            <svg
              fill="#000000"
              height="24"
              width="24"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="-143 145 512 512"
              xmlSpace="preserve"
            >
              <path
                d="M329,145h-432c-22.1,0-40,17.9-40,40v432c0,22.1,17.9,40,40,40h432c22.1,0,40-17.9,40-40V185C369,162.9,351.1,145,329,145z
        M41.4,508.1H-8.5V348.4h49.9V508.1z M15.1,328.4h-0.4c-18.1,0-29.8-12.2-29.8-27.7c0-15.8,12.1-27.7,30.5-27.7
      c18.4,0,29.7,11.9,30.1,27.7C45.6,316.1,33.9,328.4,15.1,328.4z M241,508.1h-56.6v-82.6c0-21.6-8.8-36.4-28.3-36.4
      c-14.9,0-23.2,10-27,19.6c-1.4,3.4-1.2,8.2-1.2,13.1v86.3H71.8c0,0,0.7-146.4,0-159.7h56.1v25.1c3.3-11,21.2-26.6,49.8-26.6
      c35.5,0,63.3,23,63.3,72.4V508.1z"
              />
            </svg>
          </a>
        )}
      </div>
      <div className="text-center text-sm opacity-50">
        {t("copyright", { ns: "footer" })}
      </div>
    </footer>
  );
}
