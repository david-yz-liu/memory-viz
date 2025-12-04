import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const getBrowserLanguage = () => {
    const language = navigator.language.split("-")[0];
    const supportedLanguages = ["en"];
    return supportedLanguages.includes(language) ? language : "en";
};

const webpackBackend = {
    type: "backend" as const,
    init: () => {},
    read: (
        language: string,
        namespace: string,
        callback: (error: unknown, translations: unknown) => void
    ) => {
        import(`./locales/${language}/${namespace}.json`)
            .then((resources) => {
                callback(null, resources.default || resources);
            })
            .catch((error) => {
                callback(error, null);
            });
    },
};

i18n.use(webpackBackend)
    .use(initReactI18next)
    .init({
        lng: getBrowserLanguage(),
        fallbackLng: "en",
        debug: process.env.NODE_ENV !== "production",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
