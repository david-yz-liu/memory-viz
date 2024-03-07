import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MemoryModelsUserInput from "../MemoryModels";

describe("MemoryModelsUserInput", () => {
    // submit button by default resets the form https://stackoverflow.com/a/62404526
    const onSubmitMock = jest.fn((e) => e.preventDefault());
    const setTextDataMock = jest.fn();
    const setFailureBannerMock = jest.fn();
    const jsonResult = "";

    it("does not submit the form or enable the submit button with empty textData", () => {
        const textDataMock = "";
        render(
            <MemoryModelsUserInput
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                textData={textDataMock}
                setFailureBanner={setFailureBannerMock}
                jsonResult={jsonResult}
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
            <MemoryModelsUserInput
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                textData={textDataMock}
                setFailureBanner={setFailureBannerMock}
                jsonResult={jsonResult}
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
                <MemoryModelsUserInput
                    onTextDataSubmit={onSubmitMock}
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    jsonResult={jsonResult}
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

    describe("MemoryModelsFileInput", () => {
        beforeEach(() => {
            const textDataMock = "";

            render(
                <MemoryModelsUserInput
                    onTextDataSubmit={onSubmitMock}
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    jsonResult={jsonResult}
                />
            );
        });

        afterEach(() => {
            // spies / mocks need to be manually restored to not fail subsequent tests
            jest.restoreAllMocks();
        });

        it("renders an enabled input and disabled reapply button", () => {
            const input: HTMLInputElement = screen.getByTestId("file-input");
            expect(input).toHaveProperty("disabled", false);

            const reapplyBtn = screen.getByTestId("file-input-reapply-button");
            expect(reapplyBtn).toHaveProperty("disabled", true);
        });

        it("calls console error and setTextData when file upload fails", async () => {
            const mockErrorMessage = "Mock error message";
            jest.spyOn(global, "FileReader").mockImplementationOnce(() => {
                throw new Error(mockErrorMessage);
            });
            const consoleErrorSpy = jest.spyOn(console, "error");

            const file = new File(
                [JSON.stringify({ id: 1, uuid: 2 })],
                "test.json",
                {
                    type: "application/json",
                }
            );
            const input: HTMLInputElement = screen.getByTestId("file-input");
            await waitFor(() => {
                // this needs to be awaited because of fileReader.onload being async
                fireEvent.change(input, { target: { files: [file] } });
            });

            expect(consoleErrorSpy).toHaveBeenNthCalledWith(
                1,
                `Error reading uploaded file as text. Please ensure it's in UTF-8 encoding: ${mockErrorMessage}`
            );
            expect(setTextDataMock).toHaveBeenNthCalledWith(1, null);
        });

        describe("when a file is uploaded", () => {
            const fileString = JSON.stringify({ id: 1, uuid: 2 });
            let input: HTMLInputElement;

            beforeEach(async () => {
                const file = new File([fileString], "test.json", {
                    type: "application/json",
                });
                input = screen.getByTestId("file-input");
                fireEvent.change(input, { target: { files: [file] } });
            });

            it("enables reapply Button", async () => {
                const reapplyBtn = screen.getByTestId(
                    "file-input-reapply-button"
                );
                await waitFor(() => {
                    expect(reapplyBtn).toHaveProperty("disabled", false);
                });
            });

            it("clicking reapply button calls setTextData", async () => {
                const reapplyBtn = screen.getByTestId(
                    "file-input-reapply-button"
                );

                await waitFor(() => {
                    // wait until the button is enabled to click
                    expect(reapplyBtn).toHaveProperty("disabled", false);
                    fireEvent.click(reapplyBtn);
                });

                await waitFor(() => {
                    // once from reapplyBtn onChange, once from MemoryModelsTextInput handleTextFieldChange
                    // if put within the same waitFor block as fireEvent.click(reapplyBtn), this test always passes
                    // even with the wrong expect
                    expect(setTextDataMock).toHaveBeenNthCalledWith(
                        2,
                        fileString
                    );
                });
            });
        });
    });
});
