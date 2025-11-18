import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";

// Mock canvas methods
if (typeof window.URL.createObjectURL === "undefined") {
    window.URL.createObjectURL = jest.fn();
}

global.ResizeObserver = ResizeObserver;
