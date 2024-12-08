import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./css/styles.scss";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

declare module "@mui/material/styles" {
    interface PaletteColor {
        paper?: String;
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
    const usingDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    return (
        <ThemeProvider theme={usingDarkMode ? darkTheme : lightTheme}>
            <App />
        </ThemeProvider>
    );
}

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <Root />
    </StrictMode>
);
