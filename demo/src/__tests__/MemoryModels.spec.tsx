import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MemoryModelsTab from "../MemoryModels";

describe("MemoryModelsTab", () => {
    // submit button by default resets the form https://stackoverflow.com/a/62404526
    const onSubmitMock = jest.fn((e) => e.preventDefault());
    const setTextDataMock = jest.fn();

    it("does not submit the form or enable the submit button with empty textData or fileData", () => {
        const textDataMock = "";
        render(
            <MemoryModelsTab
                onFileDataSubmit={onSubmitMock}
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                textData={textDataMock}
                setFileData={setTextDataMock}
                fileData={textDataMock}
            />
        );

        const button = screen.getByTestId("input-submit-button");
        expect(button).toHaveProperty("disabled", true);

        fireEvent.click(button);
        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("accepts changes to formData", () => {
        const textDataMock = "";

        render(
            <MemoryModelsTab
                onFileDataSubmit={onSubmitMock}
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                textData={textDataMock}
                setFileData={setTextDataMock}
                fileData={textDataMock}
            />
        );

        const updateFormData = "Updated form data";
        const input = screen.getByLabelText("Enter memory model JSON here");
        fireEvent.change(input, { target: { value: updateFormData } });

        expect(setTextDataMock).toHaveBeenCalledWith(updateFormData);
    });

    describe("with non-empty formData", () => {
        const textDataMock = "Form data";
        beforeEach(() => {
            render(
                <MemoryModelsTab
                    onFileDataSubmit={onSubmitMock}
                    onTextDataSubmit={onSubmitMock}
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFileData={setTextDataMock}
                    fileData={textDataMock}
                />
            );
        });

        it("renders an enabled submit button with correct text", async () => {
            const button = screen.getByTestId("input-submit-button");
            expect(button).toHaveProperty("disabled", false);
            expect(button.textContent).toEqual("Draw Diagram");
        });

        it("can submit the form", () => {
            const form = screen.getByTestId("input-form");
            fireEvent.submit(form);
            expect(onSubmitMock).toHaveBeenCalled();
        });
    });
});
