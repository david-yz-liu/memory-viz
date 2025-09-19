import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@picocss/pico";
import "./css/styles";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

declare module "@mui/material/styles" {
    interface PaletteColor {
        paper?: string;
    }

    interface SimplePaletteColorOptions {
        paper?: string;
    }
}

const lightTheme = createTheme({
    palette: {
        primary: {
            main: "#2a6b2c",
            dark: "#005ea5",
            light: "#72ac56",
            paper: "#ffffff",
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#89c48c",
            paper: "#cacaca",
        },
    },
});

function Root() {
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const [isDarkMode, setIsDarkMode] = useState(prefersDark);

    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <App isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </ThemeProvider>
    );
}

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <Root />
    </StrictMode>
);
