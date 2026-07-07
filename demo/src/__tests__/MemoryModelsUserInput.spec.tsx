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
import { renderWithI18n } from "../setup-jest";

describe("MemoryModelsUserInput", () => {
    const setTextDataMock = jest.fn();
    const setFailureBannerMock = jest.fn();
    const configDataMock = {
        overallDrawConfig: {
            roughjs_config: { options: { seed: 0 } },
        },
    };
    const setConfigDataMock = jest.fn();
    const onSubmitMock = jest.fn();
    const failureBannerMock = "";
    let textDataMock: string;

    beforeEach(() => {
        textDataMock = "";
    });

    it("renders Menu for MemoryModelsConfigInput", () => {
        render(
            renderWithI18n(
                <MemoryModelsUserInput
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    failureBanner={failureBannerMock}
                    configData={configDataMock}
                    setConfigData={setConfigDataMock}
                    onInputChange={onSubmitMock}
                />
            )
        );
        expect(
            screen.getByTestId("rendering-options-menu").textContent
        ).toEqual("Rendering Options");
    });

    it("renders a disabled download button with empty textData", () => {
        render(
            renderWithI18n(
                <MemoryModelsUserInput
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    failureBanner={failureBannerMock}
                    configData={configDataMock}
                    setConfigData={setConfigDataMock}
                    onInputChange={onSubmitMock}
                />
            )
        );

        const button = screen.getByTestId("download-json-btn");
        expect(button).toHaveProperty("disabled", true);
    });

    it("accepts changes to formData", () => {
        render(
            renderWithI18n(
                <MemoryModelsUserInput
                    setTextData={setTextDataMock}
                    textData={textDataMock}
                    setFailureBanner={setFailureBannerMock}
                    failureBanner={failureBannerMock}
                    configData={configDataMock}
                    setConfigData={setConfigDataMock}
                    onInputChange={onSubmitMock}
                />
            )
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
                renderWithI18n(
                    <MemoryModelsUserInput
                        setTextData={setTextDataMock}
                        textData={textDataMock}
                        setFailureBanner={setFailureBannerMock}
                        failureBanner={failureBannerMock}
                        configData={configDataMock}
                        setConfigData={setConfigDataMock}
                        onInputChange={onSubmitMock}
                    />
                )
            );
        });

        it("renders an enabled download button", async () => {
            const button = screen.getByTestId("download-json-btn");
            expect(button).toHaveProperty("disabled", false);
        });
    });

    describe("MemoryModelsFileInput", () => {
        beforeEach(() => {
            render(
                renderWithI18n(
                    <MemoryModelsUserInput
                        setTextData={setTextDataMock}
                        textData={textDataMock}
                        setFailureBanner={setFailureBannerMock}
                        failureBanner={failureBannerMock}
                        configData={configDataMock}
                        setConfigData={setConfigDataMock}
                        onInputChange={onSubmitMock}
                    />
                )
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

        it("calls console error when file upload fails", async () => {
            const mockErrorMessage = "Mock error message";
            jest.spyOn(global, "FileReader").mockImplementationOnce(() => {
                throw new Error(mockErrorMessage);
            });
            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

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
            expect(onSubmitMock).not.toHaveBeenCalled();
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

            it("clicking reapply button calls onSubmit", async () => {
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
                    expect(onSubmitMock).toHaveBeenCalledWith(fileString);
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
                renderWithI18n(
                    <MemoryModelsUserInput
                        setTextData={setTextDataMock}
                        textData={textDataMock}
                        setFailureBanner={setFailureBannerMock}
                        failureBanner={failureBannerMock}
                        configData={configDataMock}
                        setConfigData={setConfigDataMock}
                        onInputChange={onSubmitMock}
                    />
                )
            );
        });

        it("renders a number input with correct props by default", () => {
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
        });

        it("handles seed change", () => {
            fireEvent.click(screen.getByText("Rendering Options"));
            const seedInput: HTMLInputElement =
                screen.getByTestId("config-seed");
            const mockSeed = "123";
            fireEvent.blur(seedInput, { target: { value: mockSeed } });
            expect(setConfigDataMock).toHaveBeenNthCalledWith(1, {
                ...configDataMock,
                overallDrawConfig: {
                    ...configDataMock.overallDrawConfig,
                    seed: Number("123"),
                },
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

        it("handles light theme change", async () => {
            await act(async () => {
                fireEvent.click(screen.getByText("Rendering Options"));
            });

            await act(async () => {
                const theme = screen.getByLabelText("Theme");
                fireEvent.mouseDown(theme);
            });

            await act(async () => {
                const light = screen.getByRole("option", { name: "Light" });
                fireEvent.click(light);
            });

            expect(setConfigDataMock).toHaveBeenNthCalledWith(1, {
                ...configDataMock,
                overallDrawConfig: {
                    ...configDataMock.overallDrawConfig,
                    theme: "light",
                },
            });
        });
    });
});
