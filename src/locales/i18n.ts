import { initReactI18next } from "react-i18next";

import en from "./en/translation.json";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const translationsJson = {
  en: {
    translation: en,
  },
};

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: translationsJson,
    fallbackLng: "en",
    debug: false,
    returnEmptyString: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
