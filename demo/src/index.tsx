import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@picocss/pico";
import "./css/styles";

const root = createRoot(document.getElementById("app"));
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
