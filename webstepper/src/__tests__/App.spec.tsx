import { jest } from "@jest/globals";

// Mock react-syntax-highlighter before any imports that use it
jest.unstable_mockModule("react-syntax-highlighter", async () => {
    const React = await import("react");
    return {
        default: ({ children, ...props }: any) => {
            // Split text into lines and create spans for each
            const lines = String(children).split("\n");
            const startingLineNumber = props.startingLineNumber || 1;

            const lineElements = lines.map((line: string, index: number) => {
                const lineNumber = startingLineNumber + index;
                let lineProps: any = {};

                // Apply lineProps callback if present
                if (props.lineProps && typeof props.lineProps === "function") {
                    const result = props.lineProps(lineNumber);
                    if (result) {
                        lineProps = result;
                    }
                }

                return React.default.createElement(
                    "span",
                    {
                        key: index,
                        "data-line-number": lineNumber,
                        ...lineProps,
                    },
                    line,
                    "\n"
                );
            });

            const codeProps: any = {};
            if (props["data-testid"]) {
                codeProps["data-testid"] = props["data-testid"];
            }

            return React.default.createElement("code", codeProps, lineElements);
        },
    };
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithI18n } from "../setup-jest";

const { default: App } = await import("../App.js");
const { default: placeholder } = await import("../placeholder.js");

URL.createObjectURL = jest.fn(() => "mock-url");

const getStepString = (): string => {
    return screen.getByText(/Step \d+\/\d+/).textContent;
};

const getMaxStep = (): number => {
    return Number(getStepString().split("/")[1]);
};

const resetWindowData = () => {
    window.codeText = placeholder.codeText;
    window.memoryVizData = placeholder.jsonArray;

    if (placeholder.startLineNumber === undefined) {
        delete window.startLineNumber;
    } else {
        window.startLineNumber = placeholder.startLineNumber;
    }
};

describe("App", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                blob: () => Promise.resolve(new Blob()),
            } as Response)
        ) as unknown as typeof fetch;
        resetWindowData();
        render(
            renderWithI18n(<App isDarkMode={false} toggleTheme={() => {}} />)
        );
        jest.spyOn(console, "error");
    });

    afterEach(() => {
        // Verify that there are no console.error outputs
        expect(console.error).not.toHaveBeenCalled();
        jest.restoreAllMocks();
    });

    it("renders initial state correctly", async () => {
        expect(screen.getByText(/Step \d+\/\d+/)).toBeInTheDocument();
        expect(screen.getByText("Code")).toBeInTheDocument();
        expect(screen.getByText("Memory visualization")).toBeInTheDocument();
    });

    it("handles next button click correctly", () => {
        const maxStep = getMaxStep();
        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        expect(screen.getByText(`Step 2/${maxStep}`)).toBeInTheDocument();
    });

    it("handles back button click correctly", () => {
        const maxStep = getMaxStep();
        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        expect(screen.getByText(`Step 2/${maxStep}`)).toBeInTheDocument();

        // Then go back
        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(screen.getByText(`Step 1/${maxStep}`)).toBeInTheDocument();
    });

    it("prevents going below step 0", () => {
        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(screen.getByText(`Step 1/${getMaxStep()}`)).toBeInTheDocument();
    });

    it("prevents going above maximum steps", () => {
        const maxStep = getMaxStep();
        const nextButton = screen.getByText("Next");
        for (let i = 0; i < maxStep; i++) {
            fireEvent.click(nextButton);
        }

        expect(
            screen.getByText(`Step ${maxStep}/${maxStep}`)
        ).toBeInTheDocument();
    });

    it("highlights the correct line in code display", async () => {
        const codeElement = screen.getByTestId("code-box");
        expect(codeElement).not.toBeNull();
        const firstLineElement = document.querySelector(
            "code > span:nth-child(1)"
        );
        const secondLineElement = document.querySelector(
            "code > span:nth-child(2)"
        );

        expect(firstLineElement).toHaveClass("code-box__line--highlighted");

        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        expect(firstLineElement).not.toHaveClass("code-box__line--highlighted");
        expect(secondLineElement).toHaveClass("code-box__line--highlighted");
    });

    it("uses the given start line number when highlighting code", () => {
        window.codeText = "first line\nsecond line";
        window.memoryVizData = [
            {
                ...placeholder.jsonArray[0],
                lineNumber: 11,
            },
        ];
        window.startLineNumber = 10;
        const { container } = render(
            renderWithI18n(<App isDarkMode={false} toggleTheme={() => {}} />)
        );

        const highlightedLine = container.querySelector(
            ".code-box__line--highlighted"
        );

        expect(highlightedLine).toHaveAttribute("data-line-number", "11");
    });

    it("uses the first step line number when start line number is undefined", () => {
        window.codeText = "first line\nsecond line";
        window.memoryVizData = [
            {
                ...placeholder.jsonArray[0],
                lineNumber: 11,
            },
        ];
        delete window.startLineNumber;
        const { container } = render(
            renderWithI18n(<App isDarkMode={false} toggleTheme={() => {}} />)
        );

        const highlightedLine = container.querySelector(
            ".code-box__line--highlighted"
        );

        expect(highlightedLine).toHaveAttribute("data-line-number", "11");
    });

    it("updates step when arrow keys are pressed", () => {
        const maxStep = getMaxStep();
        fireEvent.keyDown(document, { key: "ArrowRight" });

        expect(screen.getByText(`Step 2/${maxStep}`)).toBeInTheDocument();

        // Then go back
        fireEvent.keyDown(document, { key: "ArrowLeft" });

        expect(screen.getByText(`Step 1/${maxStep}`)).toBeInTheDocument();
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
