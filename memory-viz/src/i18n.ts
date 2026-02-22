import i18next from "i18next";
import type { i18n } from "i18next";
import memoryModelEn from "./locales/en/memory_model.json";
import cliEn from "./locales/en/cli.json";

const getSystemLanguage = () => {
    const language = navigator.language.split("-")[0] || "en";
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

const i18nInstance: i18n = i18next
    .createInstance({
        lng: getSystemLanguage(),
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        ns: ["memory_model", "cli"],
        defaultNS: "memory_model",
        resources: {
            en: {
                memory_model: memoryModelEn,
                cli: cliEn,
            },
        },
    })
    .use(webpackBackend);

i18nInstance.init();
export default i18nInstance;
