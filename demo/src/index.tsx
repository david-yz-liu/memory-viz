import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@picocss/pico";
import "./css/styles";

import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme({
    palette: {
        primary: {
            main: "#2a6b2c",
            dark: "#005ea5",
            light: "#72ac56",
        },
    },
});

const root = createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </StrictMode>
);
