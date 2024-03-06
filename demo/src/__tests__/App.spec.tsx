import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import mem from "../../../src/index";

describe("App", () => {
    beforeEach(() => {
        render(<App />);
    });

    it("renders Output heading", () => {
        expect(screen.getByText("Output").nodeName).toEqual("H2");
    });

    it("renders ErrorBoundary fallback element when draw function throws error", () => {
        const mockErrorMessage = "Mocked error";
        const drawMockSpy = jest.spyOn(mem, "draw");
        drawMockSpy.mockImplementation(() => {
            throw new Error(mockErrorMessage);
        });

        const input = screen.getByLabelText("Enter memory model JSON here");
        // In order to get to draw function, input has to be valid json otherwise JSON.parse fails
        fireEvent.change(input, { target: { value: "[{}]" } });
        const button = screen.getByTestId("input-submit-button");
        fireEvent.click(button);

        const errorBoundary = screen.getByTestId("svg-display-error-boundary");
        expect(errorBoundary.textContent).toEqual(
            "This is valid JSON but not valid Memory Models JSON. Please refer to the repo for more details."
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
});
