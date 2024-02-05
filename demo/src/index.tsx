import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@picocss/pico";
import "./css/styles";
("use client");
import { ErrorBoundary } from "react-error-boundary";

const root = createRoot(document.getElementById("app"));
root.render(
    <StrictMode>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <App />
        </ErrorBoundary>
    </StrictMode>
);
