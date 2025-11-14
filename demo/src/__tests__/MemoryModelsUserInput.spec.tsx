import { jest } from "@jest/globals";
import React from "react";
import {
    fireEvent,
    render,
    screen,
    waitFor,
    act,
} from "@testing-library/react";
import MemoryModelsUserInput from "../MemoryModelsUserInput.js";

describe("MemoryModelsUserInput", () => {
    // submit button by default resets the form https://stackoverflow.com/a/62404526
    const onSubmitMock = jest.fn((e) => e.preventDefault());
    const setTextDataMock = jest.fn();
    const setFailureBannerMock = jest.fn();
    const configDataMock = {
        useAutomation: true,
        overallDrawConfig: {
            roughjs_config: { options: { seed: 0 } },
        },
    };
    const setConfigDataMock = jest.fn();
    const jsonResult = "";
    let textDataMock: string;

    beforeEach(() => {
        textDataMock = "";
    });

    it("renders Menu for MemoryModelsConfigInput", () => {
        render(
            <MemoryModelsUserInput
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                textData={textDataMock}
                setFailureBanner={setFailureBannerMock}
                jsonResult={jsonResult}
                configData={configDataMock}
                setConfigData={setConfigDataMock}
            />
        );
        expect(
            screen.getByTestId("rendering-options-menu").textContent
        ).toEqual("Rendering Options");
    });

    it("does not submit the form or enable the submit button with empty textData", () => {
        render(
            <MemoryModelsUserInput
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                textData={textDataMock}
                setFailureBanner={setFailureBannerMock}
                jsonResult={jsonResult}
                configData={configDataMock}
                setConfigData={setConfigDataMock}
            />
        );

        const button = screen.getByTestId("input-submit-button");
        expect(button).toHaveProperty("disabled", true);

        fireEvent.click(button);
        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("accepts changes to formData", () => {
        render(
            <MemoryModelsUserInput
                onTextDataSubmit={onSubmitMock}
                setTextData={setTextDataMock}
                textData={textDataMock}
                setFailureBanner={setFailureBannerMock}
                jsonResult={jsonResult}
                configData={configDataMock}
                setConfigData={setConfigDataMock}
            />
        );

        const updateFormData = "Updated form data";
        const input = screen.getByLabelText("Enter memory model JSON here");
        fireEvent.change(input, { target: { value: updateFormData } });

        expect(setTextDataMock).toHaveBeenCalledWith(updateFormData);
    });

    describe("with non-empty formData", () => {
        beforeEach(() => {
            textDataMock = "Form data";
            render(
                <MemoryModelsUserInput
                    onTextDataSubmit={onSubmitMock}
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    jsonResult={jsonResult}
                    configData={configDataMock}
                    setConfigData={setConfigDataMock}
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
            render(
                <MemoryModelsUserInput
                    onTextDataSubmit={onSubmitMock}
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    jsonResult={jsonResult}
                    configData={configDataMock}
                    setConfigData={setConfigDataMock}
                />
            );
        });

        afterEach(() => {
            // spies / mocks need to be manually restored to not fail subsequent tests
            jest.restoreAllMocks();
        });

        it("does not render the dialog when the page first loads", () => {
            const dialog = screen.queryByTestId("file-input-dialog");
            expect(dialog).toBeNull();

            const input: HTMLInputElement = screen.queryByTestId("file-input");
            expect(input).toBeNull();
        });

        it("renders an enabled input and disabled reapply button", () => {
            fireEvent.click(screen.getByText("Upload JSON File"));
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
            fireEvent.click(screen.getByText("Upload JSON File"));
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
                fireEvent.click(screen.getByText("Upload JSON File"));
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
                    // if put within the same waitFor block as fireEvent.click(reapplyBtn), this test always passes
                    // even with the wrong expect
                    expect(setTextDataMock).toHaveBeenCalledWith(fileString);
                });
            });

            it("closing the dialog resets the file input", async () => {
                const reapplyBtn = screen.getByTestId(
                    "file-input-reapply-button"
                );

                await waitFor(() => {
                    // wait until the button is enabled
                    expect(reapplyBtn).toHaveProperty("disabled", false);
                    // click off the dialog window
                    fireEvent.keyDown(
                        screen.queryByTestId("file-input-dialog"),
                        {
                            key: "Escape",
                            code: "Escape",
                            keyCode: 27,
                            charCode: 27,
                        }
                    );
                });

                await waitFor(() => {
                    // // expect dialog to no longer be there
                    expect(
                        screen.queryByTestId("file-input-dialog")
                    ).toBeNull();

                    // // re-open the modal, reapplyBtn should be disabled
                    fireEvent.click(screen.getByText("Upload JSON File"));
                    expect(reapplyBtn).toHaveProperty("disabled", true);
                });
            });
        });
    });

    describe("MemoryModelsConfigInput", () => {
        beforeEach(() => {
            render(
                <MemoryModelsUserInput
                    onTextDataSubmit={onSubmitMock}
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    jsonResult={jsonResult}
                    configData={configDataMock}
                    setConfigData={setConfigDataMock}
                />
            );
        });

        it("renders a number input with correct props and checkbox that is checked by default", () => {
            fireEvent.click(screen.getByText("Rendering Options"));
            const seedInput: HTMLInputElement =
                screen.getByTestId("config-seed");
            [
                ["max", (2 ** 31).toString()],
                ["min", "0"],
                ["type", "number"],
            ].forEach(([property, value]) => {
                expect(seedInput).toHaveProperty(property, value);
            });

            // According to https://mui.com/material-ui/react-checkbox/#accessibility, checkboxes should always
            // have labels, so testing with label text rather than data-testid here.
            const automationCheckbox: HTMLInputElement = screen.getByLabelText(
                "Use automatic layout"
            );
            expect(automationCheckbox.checked).toBe(true);
        });

        it("handles seed change", () => {
            fireEvent.click(screen.getByText("Rendering Options"));
            const seedInput: HTMLInputElement =
                screen.getByTestId("config-seed");
            const mockSeed = "123";
            fireEvent.change(seedInput, { target: { value: mockSeed } });
            expect(setConfigDataMock).toHaveBeenNthCalledWith(1, {
                ...configDataMock,
                overallDrawConfig: {
                    ...configDataMock.overallDrawConfig,
                    seed: Number("123"),
                },
            });
        });

        it("handles automation change", () => {
            fireEvent.click(screen.getByText("Rendering Options"));
            const automationCheckbox: HTMLInputElement = screen.getByLabelText(
                "Use automatic layout"
            );
            fireEvent.click(automationCheckbox);
            expect(setConfigDataMock).toHaveBeenNthCalledWith(1, {
                ...configDataMock,
                useAutomation: false,
            });
        });

        it("handles dark theme change", async () => {
            await act(async () => {
                fireEvent.click(screen.getByText("Rendering Options"));
            });

            await act(async () => {
                const theme = screen.getByLabelText("Theme");
                fireEvent.mouseDown(theme);
            });

            await act(async () => {
                const dark = screen.getByRole("option", { name: "Dark" });
                fireEvent.click(dark);
            });

            expect(setConfigDataMock).toHaveBeenNthCalledWith(1, {
                ...configDataMock,
                overallDrawConfig: {
                    ...configDataMock.overallDrawConfig,
                    theme: "dark",
                },
            });
        });

        it("handles match website theme change", async () => {
            await act(async () => {
                fireEvent.click(screen.getByText("Rendering Options"));
            });

            await act(async () => {
                const theme = screen.getByLabelText("Theme");
                fireEvent.mouseDown(theme);
            });

            await act(async () => {
                const dark = screen.getByRole("option", {
                    name: "Match website",
                });
                fireEvent.click(dark);
            });

            expect(setConfigDataMock).toHaveBeenNthCalledWith(1, {
                ...configDataMock,
                overallDrawConfig: {
                    ...configDataMock.overallDrawConfig,
                    theme: "match",
                },
            });
        });
    });
});
