import React from "react";
import { render, screen } from "@testing-library/react";
import SvgDisplay from "../SvgDisplay";
import mem from "../../../src/index";
const { draw } = mem;

const mockMemoryModels = {
    serializeSVG: jest.fn(),
    clear: jest.fn(),
    render: jest.fn(),
};

jest.mock("../../../src/index", () => ({
    draw: jest.fn(() => mockMemoryModels),
}));

describe("SvgDisplay", () => {
    const setSvgResultMock = jest.fn();

    describe("when jsonResult is not null", () => {
        let jsonResult: Object;

        beforeEach(() => {
            // In order to get to draw function, input has to be valid json otherwise JSON.parse fails
            jsonResult = [{}];
            render(
                <SvgDisplay
                    jsonResult={jsonResult}
                    setSvgResult={setSvgResultMock}
                />
            );
        });

        it("renders canvas element with specified dimensions", () => {
            const canvasElement = screen.getByTestId("memory-models-canvas");
            expect(canvasElement.getAttribute("width")).toEqual("1300");
            expect(canvasElement.getAttribute("height")).toEqual("1000");
        });

        it("calls functions with correct parameters", () => {
            expect(draw).toHaveBeenNthCalledWith(1, jsonResult, true, {
                width: 1300,
            });
            expect(setSvgResultMock).toHaveBeenNthCalledWith(
                1,
                mockMemoryModels.serializeSVG()
            );
            expect(mockMemoryModels.clear).toHaveBeenCalledTimes(1);
            expect(mockMemoryModels.render).toHaveBeenCalledTimes(1);
        });
    });

    it("does not render any diagrams when jsonResult is null", () => {
        render(
            <SvgDisplay jsonResult={null} setSvgResult={setSvgResultMock} />
        );
        const canvasElement = screen.getByTestId("memory-models-canvas");
        expect(canvasElement.getAttribute("ref")).toBeNull();
    });
});
