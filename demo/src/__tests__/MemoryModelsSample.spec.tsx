import { jest } from "@jest/globals";

jest.unstable_mockModule("../sample/manual-layout/data", () => ({
    default: { sample: "manualLayout" },
}));

jest.unstable_mockModule("../sample/manual-layout/config", () => ({
    default: { config: "config", overallDrawConfig: {} },
}));

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const { default: MemoryModelsSample } = await import(
    "../MemoryModelsSample.js"
);
const { SAMPLES } = await import("../sample/index.js");
import { renderWithI18n } from "../setup-jest";

describe("MemoryModelsSample", () => {
    const onInputChangeMock = jest.fn();

    beforeEach(() => {
        render(
            renderWithI18n(
                <MemoryModelsSample onInputChange={onInputChangeMock} />
            )
        );
    });

    it("renders Menu", () => {
        expect(screen.getByTestId("sample-inputs-menu").textContent).toEqual(
            "Sample Inputs"
        );
        expect(screen.getByText("Sample Inputs")).toBeDefined();
    });

    it("renders all sample buttons", async () => {
        // sx for MUI comps or non-inline CSS in general will not be loaded into Jest by default
        // might be achievable with some libs but this test makes sure the base texts are present.
        // Therefore, we can't test for capitalization (via sx) here
        fireEvent.click(screen.getByText("Sample Inputs"));
        await waitFor(() => {
            SAMPLES.map((sample) =>
                expect(screen.getByText(sample["name"])).toBeDefined()
            );
        });
    });

    it("handles sample button click", async () => {
        fireEvent.click(screen.getByText("Sample Inputs"));
        const button = screen.getByText("Manual Layout");
        fireEvent.click(button);

        // Wait for state updates and side effects to complete
        await waitFor(() => {
            expect(onInputChangeMock).toHaveBeenCalledWith(
                JSON.stringify({ sample: "manualLayout" }, null, 4),
                { config: "config", overallDrawConfig: {} }
            );
        });
    });
});
