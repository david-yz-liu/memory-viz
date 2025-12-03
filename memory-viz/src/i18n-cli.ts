import i18n from "i18next";
import Backend from "i18next-fs-backend";
import * as path from "path";

i18n.use(Backend).init({
    lng: process.env.LANG?.split("_")[0] || "en",
    fallbackLng: "en",
    debug: false,
    interpolation: {
        escapeValue: false,
    },
    backend: {
        loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
    },
});

export default i18n;
