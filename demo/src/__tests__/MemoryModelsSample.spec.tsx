jest.mock(
    "../sample/automation/automation.json",
    () => ({ sample: "automation" }),
    { virtual: true }
);
jest.mock("../sample/automation/config.json", () => ({ config: "config" }), {
    virtual: true,
});

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MemoryModelsSample from "../MemoryModelsSample";
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

    it("renders Accordion", () => {
        expect(
            screen.getByTestId("sample-inputs-accordion").textContent
        ).toEqual("Sample Inputs");
        expect(screen.getByText("Sample Inputs")).toBeDefined();
    });

    it("renders all sample buttons", () => {
        // sx for MUI comps or non-inline CSS in general will not be loaded into Jest by default
        // might be achievable with some libs but this test makes sure the base texts are present.
        // Therefore, we can't test for capitalization (via sx) here
        ["automation", "blankspace", "manual", "simple", "style"].map(
            (sample) => expect(screen.getByText(sample)).toBeDefined()
        );
    });

    it("handles sample button click", async () => {
        const button = screen.getByText("automation");
        fireEvent.click(button);

        // Wait for state updates and side effects to complete
        await waitFor(() => {
            expect(setTextDataMock).toHaveBeenCalledWith(
                JSON.stringify({ sample: "automation" }, null, 2)
            );
            expect(nextState).toEqual({ config: "config" });
            expect(onSubmitMock).toHaveBeenCalled();
        });
    });
});
