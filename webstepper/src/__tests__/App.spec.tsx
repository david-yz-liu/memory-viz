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
                    { key: index, ...lineProps },
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

jest.unstable_mockModule(
    "react-syntax-highlighter/dist/esm/styles/hljs",
    () => ({
        a11yLight: {},
    })
);

import "@testing-library/jest-dom";
const { default: React } = await import("react");
const { render, screen, fireEvent } = await import("@testing-library/react");
const { default: App } = await import("../App.js");

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
    })
) as any;

URL.createObjectURL = jest.fn(() => "mock-url");

const getStepString = (): string => {
    return screen.getByText(/Step \d+\/\d+/).textContent;
};

const getMaxStep = (): number => {
    return Number(getStepString().split("/")[1]);
};

describe("App", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                blob: () => Promise.resolve(new Blob()),
            })
        ) as any;
        render(<App isDarkMode={false} toggleTheme={() => {}} />);
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

    it("updates step when arrow keys are pressed", () => {
        const maxStep = getMaxStep();
        fireEvent.keyDown(document, { key: "ArrowRight" });

        expect(screen.getByText(`Step 2/${maxStep}`)).toBeInTheDocument();

        // Then go back
        fireEvent.keyDown(document, { key: "ArrowLeft" });

        expect(screen.getByText(`Step 1/${maxStep}`)).toBeInTheDocument();
    });
});
