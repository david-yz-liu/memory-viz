import i18n from "i18next";
import memoryModelEn from "./locales/en/memory_model.json";
import cliEn from "./locales/en/cli.json";

const getSystemLanguage = () => {
    const language = process.env.LANG?.split("_")[0] || "en";
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

i18n.use(webpackBackend).init({
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
});

export default i18n;
