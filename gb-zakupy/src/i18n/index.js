import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pl from "./locales/pl.json";
import en from "./locales/en.json";
import uk from "./locales/uk.json";

const savedLanguage = localStorage.getItem("gb-language");
const browserLanguage = navigator.language.split("-")[0];
const supportedLanguages = ["pl", "en", "uk"];

const language =
    savedLanguage ||
    (supportedLanguages.includes(browserLanguage)
        ? browserLanguage
        : "pl");

i18n
    .use(initReactI18next)
    .init({
        resources: {
            pl: {
                translation: pl,
            },
            en: {
                translation: en,
            },
            uk: {
                translation: uk,
            },
        },

        lng: language,
        fallbackLng: "pl",
        supportedLngs: supportedLanguages,

        interpolation: {
            escapeValue: false,
        },

        debug: false,
    });

export default i18n;
