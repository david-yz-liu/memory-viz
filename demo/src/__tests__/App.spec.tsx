import { jest } from "@jest/globals";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App.js";
import { renderWithI18n } from "../setup-jest";

describe("App", () => {
    beforeEach(() => {
        render(
            renderWithI18n(<App isDarkMode={false} toggleTheme={() => {}} />)
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("renders Output heading", () => {
        jest.spyOn(console, "error");

        expect(screen.getByText("Output").nodeName).toEqual("H2");
        expect(console.error).not.toHaveBeenCalled();
    });

    it("renders ErrorBoundary fallback element when draw function throws error", async () => {
        const spy = jest
            .spyOn(global.console, "error")
            .mockImplementation(() => {});
        const input = screen.getByLabelText("Enter memory model JSON here");

        // Invalid input: 'type' should be a valid string type, but it's a number
        const invalidJSON = JSON.stringify([{ type: 123 }]);
        fireEvent.change(input, { target: { value: invalidJSON } });

        await waitFor(
            () => {
                const errorBoundary = screen.getByTestId("failure-banner");
                expect(errorBoundary.textContent).toEqual(
                    expect.stringMatching(
                        /^✖ Invalid discriminator value\..*\n\s*→ at type$/
                    )
                );
            },
            { timeout: 2000 }
        );
        spy.mockRestore();
    });

    it("calls console error, renders Alert banner, and renders disabled download button when the input is not valid JSON", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();

        const input = screen.getByLabelText("Enter memory model JSON here");
        fireEvent.change(input, { target: { value: "*&#*#(@(!(" } });

        await waitFor(
            () => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    expect.stringMatching(/^Error parsing inputted JSON: /)
                );
            },
            { timeout: 2000 }
        );
        const alertBanner = screen.getByTestId("failure-banner");
        expect(alertBanner.textContent).toEqual(
            expect.stringMatching(/^Error parsing inputted JSON/)
        );

        const downloadJSONButton = screen.queryByTestId("download-json-btn");
        expect(downloadJSONButton).toHaveProperty("disabled");
        const downloadSVGButton = screen.queryByTestId("download-svg-btn");
        expect(downloadSVGButton).toHaveProperty("disabled");
    });

    it("resets ErrorBoundary when valid JSON is provided after an invalid memory-viz JSON", async () => {
        const spy = jest
            .spyOn(global.console, "error")
            .mockImplementation(() => {});
        const input = screen.getByLabelText("Enter memory model JSON here");

        // Invalid input: 'type' should be a valid string type, but it's a number
        const invalidJSON = JSON.stringify([{ type: 123 }]);
        fireEvent.change(input, { target: { value: invalidJSON } });

        await waitFor(
            () => {
                const errorBoundary = screen.getByTestId("failure-banner");
                expect(errorBoundary.textContent).toEqual(
                    expect.stringMatching(
                        /^✖ Invalid discriminator value\..*\n\s*→ at type$/
                    )
                );
            },
            { timeout: 2000 }
        );

        // Next, reset by selecting a sample input that's valid memory-viz JSON.
        fireEvent.click(screen.getByText("Sample Inputs"));
        fireEvent.click(screen.getByText("Manual Layout"));

        // Finally, test that the ErrorBoundary message doesn't appear, and that the canvas is reappearing after resetting
        await waitFor(
            () => {
                expect(screen.queryByTestId("failure-banner")).toBeNull();
            },
            { timeout: 2000 }
        );
        expect((input as HTMLTextAreaElement).value).toEqual(
            expect.stringContaining("David is cool!")
        );
        expect(screen.getByTestId("memory-models-svg")).toBeTruthy();
        spy.mockRestore();
    });

    it("renders translated text in English by default", () => {
        expect(screen.getByText("Output")).toBeDefined();
        expect(screen.getByText("Input")).toBeDefined();
    });

    it("updates html lang attribute when language is changed", async () => {
        const setAttributeSpy = jest.spyOn(
            document.documentElement,
            "setAttribute"
        );

        const button = screen.getByTestId("change-language-button");
        fireEvent.click(button);

        const menuItem = await screen.findByText("English");
        fireEvent.click(menuItem);

        await waitFor(() => {
            expect(setAttributeSpy).toHaveBeenCalledWith("lang", "en");
            expect(document.documentElement.lang).toBe("en");
        });
        setAttributeSpy.mockRestore();
    });
});
