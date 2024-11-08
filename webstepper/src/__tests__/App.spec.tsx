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
        expect(screen.getByText("Line: 1")).toBeInTheDocument();
        expect(screen.getByText("Code")).toBeInTheDocument();
        expect(screen.getByText("Memory diagrams")).toBeInTheDocument();
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/images/snapshot-0.svg");
        });
    });

    it("handles next button click correctly", () => {
        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        expect(screen.getByText("Line: 2")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/images/snapshot-1.svg");
    });

    it("handles back button click correctly", () => {
        // First go forward
        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        // Then go back
        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(screen.getByText("Line: 1")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/images/snapshot-0.svg");
    });

    it("prevents going below step 0", () => {
        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(screen.getByText("Line: 1")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/images/snapshot-0.svg");
    });

    it("prevents going above maximum steps", () => {
        // The limit is 4 (defined in App.tsx)
        const nextButton = screen.getByText("Next");
        for (let i = 0; i < 5; i++) {
            fireEvent.click(nextButton);
        }

        expect(screen.getByText("Line: 4")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/images/snapshot-3.svg");
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
