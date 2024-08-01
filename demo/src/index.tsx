import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@picocss/pico";
import "./css/styles";

import AppTwo from "./AppTwo";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme({
    palette: {
        primary: {
            main: "#2a6b2c",
            dark: "#005ea5",
            light: "#72ac56",
        },
    },
    typography: {
        fontFamily: "Open Sans, Arial, sans-serif",
    },
});

const root = createRoot(document.getElementById("app"));
root.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <AppTwo />
        </ThemeProvider>
    </StrictMode>
);
