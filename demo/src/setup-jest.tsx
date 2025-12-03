import { jest } from "@jest/globals";
import ResizeObserver from "resize-observer-polyfill";
import React, { ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../public/locales/en/translation.json";
import frTranslations from "../public/locales/fr/translation.json";

// jsdom issue. Usable solution from https://stackoverflow.com/a/74063955
if (typeof window.URL.createObjectURL === "undefined") {
    window.URL.createObjectURL = jest.fn();
}

global.ResizeObserver = ResizeObserver;

// Create a test i18n instance
const testI18n = i18n.createInstance();

testI18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: enTranslations,
        },
        fr: {
            translation: frTranslations,
        },
    },
});

export function renderWithI18n(component: ReactElement) {
    return <I18nextProvider i18n={testI18n}>{component}</I18nextProvider>;
}

export { testI18n };
