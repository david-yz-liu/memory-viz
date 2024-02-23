import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
    beforeEach(() => {
        render(<App />);
    });

    it("renders Output heading", () => {
        expect(screen.getByText("Output").nodeName).toEqual("H2");
    });

    it("renders ErrorBoundary fallback element when draw function throws error", () => {
        jest.mock("../../../src/index", () => ({
            draw: jest.fn(() => {
                throw new Error();
            }),
        }));
        const input = screen.getByLabelText("Enter memory model JSON here");
        // In order to get to draw function, input has to be valid json otherwise JSON.parse fails
        fireEvent.change(input, { target: { value: "[{}]" } });
        const button = screen.getByTestId("input-submit-button");
        fireEvent.click(button);

        const errorBoundary = screen.getByTestId("svg-display-error-boundary");
        expect(errorBoundary.textContent).toEqual("Something went wrong");
    });

    it("calls console error when the input is not valid JSON", () => {
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
    });
});
