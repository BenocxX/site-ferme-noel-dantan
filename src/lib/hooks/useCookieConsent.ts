import { useState } from "react";
import { useCookies } from "react-cookie";

export type UseCookieConsentParams = {
  key: string;
  maxAge?: number;
};

export function useCookieConsent(
  { key, maxAge }: UseCookieConsentParams = { key: "cookieConsent" },
) {
  const [cookies, setCookie, remove] = useCookies<
    string,
    { cookieConsent?: "accept" | "refuse" }
  >([key]);

  const [hasConsent, setHasConsent] = useState(
    cookies.cookieConsent === "accept" || cookies.cookieConsent === "refuse",
  );
  const [hasAccepted, setHasAccepted] = useState(
    cookies.cookieConsent === "accept",
  );
  const [hasRefused, setHasRefused] = useState(
    cookies.cookieConsent === "refuse",
  );

  function setConsentCookie(value: "accept" | "refuse") {
    setCookie(key, value, { maxAge: maxAge || 365 * 24 * 60 * 60 }); // 1 year
    setHasConsent(true);
    setHasAccepted(value === "accept");
    setHasRefused(value === "refuse");
    window.location.reload();
  }

  return {
    hasConsent,
    hasAccepted,
    hasRefused,
    accept: () => setConsentCookie("accept"),
    refuse: () => setConsentCookie("refuse"),
    remove: () => {
      remove(key);
      setHasConsent(false);
      setHasAccepted(false);
      setHasRefused(false);
    },
  };
}