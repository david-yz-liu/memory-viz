import React, { StrictMode, useState, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "@picocss/pico";
import "./css/styles";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery, CssBaseline } from "@mui/material";

// i18n configuration
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: process.env.NODE_ENV !== "production",
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
    });

declare module "@mui/material/styles" {
    interface PaletteColor {
        paper?: string;
    }

    interface SimplePaletteColorOptions {
        paper?: string;
    }
}

const baseTheme = {
    typography: {
        h1: {
            fontSize: "34.px",
            fontWeight: 700,
        },
        h2: {
            fontSize: "29.75px",
            fontWeight: 700,
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                h1: {
                    marginTop: "16px",
                    marginBottom: "12px",
                },
                h2: {
                    marginTop: "16px",
                    marginBottom: "10px",
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    padding: "2px",
                    width: "34px",
                    height: "34px",
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    width: "30px",
                    height: "30px",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                img: {
                    width: "100px",
                    objectFit: "contain",
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
            },
        },
    },
};

const lightTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: "light",
        primary: {
            main: "#2e8555",
            dark: "#29784c",
            light: "#33925d",
        },
        background: {
            default: "#ffffff",
            paper: "#f5f5f5",
        },
        text: {
            primary: "#222222",
            secondary: "#333333",
        },
    },
});

const darkTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: "dark",
        primary: {
            main: "#25c2a0",
            dark: "#21af90",
            light: "#29d5b0",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#e0e0e0",
            secondary: "#aaaaaa",
        },
    },
});

function Root() {
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const [isDarkMode, setIsDarkMode] = useState(prefersDark);

    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    const theme = isDarkMode ? darkTheme : lightTheme;

    React.useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isDarkMode ? "dark" : "light"
        );
    }, [isDarkMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </ThemeProvider>
    );
}

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
            <Root />
        </Suspense>
    </StrictMode>
);
