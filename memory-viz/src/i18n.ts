import i18n from "i18next";

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
});

export default i18n;
