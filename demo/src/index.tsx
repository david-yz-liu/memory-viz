import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@picocss/pico";
import "./css/styles";

import { createTheme } from "@mui/material/styles";

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
            paper: "#dadada",
        },
    },
});

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);

export { lightTheme, darkTheme };
