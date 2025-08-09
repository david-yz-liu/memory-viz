import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("App", () => {
    beforeEach(() => {
        render(<App />);
    });

    it("renders Output heading", () => {
        expect(screen.getByText("Output").nodeName).toEqual("H2");
    });

    it("renders ErrorBoundary fallback element when draw function throws error", () => {
        const input = screen.getByLabelText("Enter memory model JSON here");

        // Invalid input: 'type' should be a string, but it's a number
        const invalidJSON = JSON.stringify([{ type: 123 }]);
        fireEvent.change(input, { target: { value: invalidJSON } });

        const button = screen.getByTestId("input-submit-button");
        fireEvent.click(button);

        const errorBoundary = screen.getByTestId("svg-display-error-boundary");
        expect(errorBoundary.textContent).toEqual(
            '✖ "type" field must be a string\n' + "  → at type"
        );
    });

    it("calls console error, renders Alert banner, and renders disabled download button when the input is not valid JSON", () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();

        const input = screen.getByLabelText("Enter memory model JSON here");
        fireEvent.change(input, { target: { value: "*&#*#(@(!(" } });
        const button = screen.getByTestId("input-submit-button");
        fireEvent.click(button);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringMatching(/^Error parsing inputted JSON: /)
        );
        const alertBanner = screen.getByTestId("json-parse-alert");
        expect(alertBanner.textContent).toEqual(
            expect.stringMatching(/^Error parsing inputted JSON/)
        );

        const downloadJSONButton = screen.queryByTestId("download-json-btn");
        expect(downloadJSONButton).toHaveProperty("disabled");
        const downloadSVGButton = screen.queryByTestId("download-svg-btn");
        expect(downloadSVGButton).toHaveProperty("disabled");
    });

    it("resets ErrorBoundary when valid JSON is provided after an invalid memory-viz JSON", async () => {
        const input = screen.getByLabelText("Enter memory model JSON here");

        // Invalid input: 'type' should be a string, but it's a number
        const invalidJSON = JSON.stringify([{ type: 123 }]);
        fireEvent.change(input, { target: { value: invalidJSON } });

        const button = screen.getByTestId("input-submit-button");
        fireEvent.click(button);

        const errorBoundary = screen.getByTestId("svg-display-error-boundary");
        expect(errorBoundary.textContent).toEqual(
            '✖ "type" field must be a string\n' + "  → at type"
        );

        // Next, reset and input valid JSON that's also valid memory-viz JSON
        const validJSON = JSON.stringify([
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
            },
        ]);
        fireEvent.change(input, { target: { value: validJSON } });
        fireEvent.click(button);

        // Finally, test that the ErrorBoundary message doesn't appear, and that the canvas is reappearing after resetting
        await waitFor(() => {
            expect(
                screen.queryByTestId("svg-display-error-boundary")
            ).toBeNull();
        });
        expect(screen.getByTestId("memory-models-canvas")).toBeTruthy();
    });
});
