import React from "react";
import { render, screen } from "@testing-library/react";
import SvgDisplay from "../SvgDisplay";
import mem from "../../../src/index";
const { draw } = mem;

jest.mock("../../../src/index", () => ({
    draw: jest.fn(() => ({
        clear: jest.fn(),
        render: jest.fn(),
    })),
}));

describe("SvgDisplay", () => {
    describe("when jsonResult is not null", () => {
        let jsonResult: Object;
        beforeEach(() => {
            jsonResult = [
                {
                    isClass: true,
                    name: "__main__",
                    id: null,
                    value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
                    stack_frame: true,
                },
                {
                    isClass: false,
                    name: "str",
                    id: 19,
                    value: "David is cool!",
                    style: ["highlight"],
                },
                { isClass: false, name: "int", id: 13, value: 7 },
            ];
            render(<SvgDisplay jsonResult={jsonResult} />);
        });

        it("renders canvas element with specified dimensions", () => {
            const canvasElement = screen.getByTestId("memory-models-canvas");
            expect(canvasElement.getAttribute("width")).toEqual("1000");
            expect(canvasElement.getAttribute("height")).toEqual("1000");
        });

        it("calls draw function with correct parameters", () => {
            expect(draw).toHaveBeenCalledWith(jsonResult, true, {
                width: 1300,
            });
        });
    });

    it("does not render any diagrams when jsonResult is null", () => {
        render(<SvgDisplay jsonResult={null} />);
        const canvasElement = screen.getByTestId("memory-models-canvas");
        expect(canvasElement.getAttribute("ref")).toBeNull();
    });
});
