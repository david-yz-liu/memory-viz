jest.mock(
    "../sample/automated-layout/data.json",
    () => ({ sample: "automation" }),
    { virtual: true }
);
jest.mock(
    "../sample/automated-layout/config.json",
    () => ({ config: "config" }),
    {
        virtual: true,
    }
);

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MemoryModelsSample from "../MemoryModelsSample";
import { SAMPLES } from "../sample";

describe("MemoryModelsSample", () => {
    // submit button by default resets the form https://stackoverflow.com/a/62404526
    const onSubmitMock = jest.fn(() => {});
    const setTextDataMock = jest.fn();
    let nextState;
    let setConfigDataMock;

    beforeEach(() => {
        setConfigDataMock = jest.fn().mockImplementation((callback) => {
            nextState = callback({ config: "config" });
        });

        render(
            <MemoryModelsSample
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                setConfigData={setConfigDataMock}
            />
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
        const button = screen.getByText("Automated Layout");
        fireEvent.click(button);

        // Wait for state updates and side effects to complete
        await waitFor(() => {
            expect(setTextDataMock).toHaveBeenCalledWith(
                JSON.stringify({ sample: "automation" }, null, 4)
            );
            expect(nextState).toEqual({ config: "config" });
            expect(onSubmitMock).toHaveBeenCalled();
        });
    });
});
