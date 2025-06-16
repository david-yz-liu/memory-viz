import "@testing-library/jest-dom";

// Mock canvas methods
if (typeof window.URL.createObjectURL === "undefined") {
    window.URL.createObjectURL = jest.fn();
}

global.ResizeObserver = require("resize-observer-polyfill");
