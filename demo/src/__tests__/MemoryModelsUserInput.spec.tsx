import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemoryModelsUserInput from "../MemoryModels";
import { before } from "node:test";

describe("MemoryModelsUserInput", () => {
    // submit button by default resets the form https://stackoverflow.com/a/62404526
    const onSubmitMock = jest.fn((e) => e.preventDefault());
    const setFormDataMock = jest.fn();

    it("does not submit the form or enable the submit button with empty formData", () => {
        const formDataMock = "";
        render(
            <MemoryModelsUserInput
                onSubmit={onSubmitMock}
                setFormData={setFormDataMock}
                formData={formDataMock}
            />
        );

        const button = screen.getByTestId("input-submit-button");
        expect(button).toHaveProperty("disabled", true);

        fireEvent.click(button);
        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("accepts changes to formData", () => {
        const formDataMock = "";

        render(
            <MemoryModelsUserInput
                setFormData={setFormDataMock}
                formData={formDataMock}
            />
        );

        const updateFormData = "Updated form data";
        const input = screen.getByLabelText("Enter memory model JSON here");
        fireEvent.change(input, { target: { value: updateFormData } });

        expect(setFormDataMock).toHaveBeenCalledWith(updateFormData);
    });

    describe("with non-empty formData", () => {
        const formDataMock = "Form data";
        beforeEach(() => {
            render(
                <MemoryModelsUserInput
                    onSubmit={onSubmitMock}
                    setFormData={setFormDataMock}
                    formData={formDataMock}
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
