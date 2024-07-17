import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

import enTranslations from "./en/index";
import frTranslations from "./fr/index";

i18next.use(initReactI18next).init({
  lng: "fr",
  fallbackLng: "en",
  supportedLngs: ["fr", "en"],
  resources: {
    en: enTranslations,
    fr: frTranslations,
  },
});

z.setErrorMap(makeZodI18nMap({ ns: ["zod", "zod_custom"] }));
