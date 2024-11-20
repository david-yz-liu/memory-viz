import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
    })
) as jest.Mock;

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
        ) as jest.Mock;
        render(<App />);
    });

    it("renders initial state correctly", async () => {
        expect(screen.getByText(/Step \d+\/\d+/)).toBeInTheDocument();
        expect(screen.getByText("Code")).toBeInTheDocument();
        expect(screen.getByText("Memory diagrams")).toBeInTheDocument();
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
});
