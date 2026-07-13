import { jest } from "@jest/globals";
import React from "react";
// Paired with RealSvgDisplay so render() shares its react instance
// otherwise, hooks throw "Invalid hook call" errors
import {
    render as renderReal,
    screen as screenReal,
    fireEvent as fireEventReal,
} from "@testing-library/react";

// Import the unmocked component first, for the hover-interactivity tests
const { default: RealSvgDisplay } = await import("../SvgDisplay.js");

const SERIALIZED_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="900" viewBox="0 0 1300 900"><rect id="object-0" /></svg>';
const mockDrawResult = {
    serializeSVG: jest.fn(() => SERIALIZED_SVG),
    height: 1000,
};
jest.unstable_mockModule("memory-viz", () => ({
    default: {
        draw: jest.fn(() => mockDrawResult),
    },
}));
jest.resetModules(); // clear the module registry so that the mock is applied to the next import.

const { default: SvgDisplay } = await import("../SvgDisplay.js");
const { draw } = (await import("memory-viz")).default;
const { render, screen } = await import("@testing-library/react");

// shared default props for SvgDisplay tests
const seedMock = 1234;
const configDataMock = { overallDrawConfig: { seed: seedMock } };

const setSvgResultMock = jest.fn();
const setFailureBannerMock = jest.fn();
const setIsValidJsonMock = jest.fn();

// Helper function to find the text.id element corresponding to a given id value
function getIdTextElement(root: Element, idValue: string): Element {
    const idTextElements = Array.from(root.querySelectorAll("text.id"));
    const match = idTextElements.find((el) => {
        const textNode = Array.from(el.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE
        );
        return textNode?.nodeValue?.trim() === idValue;
    });
    if (!match) {
        throw new Error(`Could not find text.id element for ${idValue}`);
    }
    return match;
}

describe("SvgDisplay (mocked memory-viz)", () => {
    describe("when jsonResult is null", () => {
        it("does not render any diagrams", () => {
            render(
                <SvgDisplay
                    jsonResult={null}
                    setSvgResult={setSvgResultMock}
                    setFailureBanner={setFailureBannerMock}
                    setIsValidJson={setIsValidJsonMock}
                    configData={configDataMock}
                />
            );

            const container = screen.getByTestId("memory-models-svg");
            expect(container.querySelector("svg")).toBeNull();
        });
    });

    describe.each([
        ["valid JSON but not valid Memory Models JSON", [{}]],
        [
            "valid JSON and valid Memory Models JSON",
            [
                {
                    type: ".frame",
                    name: "__main__",
                    value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
                },
                {
                    type: "str",
                    id: 19,
                    value: "David is cool!",
                    style: ["highlight"],
                },
                {
                    type: "int",
                    id: 13,
                    value: 7,
                },
            ],
        ],
    ])("when jsonResult is not null and %s", (_, jsonResult) => {
        beforeEach(() => {
            render(
                <SvgDisplay
                    jsonResult={jsonResult}
                    setSvgResult={setSvgResultMock}
                    setFailureBanner={setFailureBannerMock}
                    setIsValidJson={setIsValidJsonMock}
                    configData={configDataMock}
                />
            );
        });

        it("renders the drawn SVG element with specified dimensions", () => {
            const container = screen.getByTestId("memory-models-svg");
            const svgElement = container.querySelector("svg");
            expect(svgElement).not.toBeNull();
            expect(svgElement.querySelector("#object-0")).not.toBeNull();
            expect(svgElement.getAttribute("height")).toEqual("900");
            expect(svgElement.getAttribute("viewBox")).toEqual("0 0 1300 900");
        });

        it("calls functions with correct parameters", () => {
            expect(draw).toHaveBeenNthCalledWith(1, jsonResult, {
                seed: seedMock,
                width: 1300,
            });
            expect(setSvgResultMock).toHaveBeenNthCalledWith(1, SERIALIZED_SVG);
        });
    });
});

describe("SvgDisplay (real memory-viz) hover interactivity", () => {
    const jsonResult = [
        { type: ".frame", name: "__main__", value: { x: 13 } },
        { type: "int", id: 13, value: 7 },
    ];

    it("highlights the referenced object's box on hover and un-highlights it on mouseout", () => {
        renderReal(
            <RealSvgDisplay
                jsonResult={jsonResult}
                setSvgResult={jest.fn()}
                setFailureBanner={jest.fn()}
                setIsValidJson={jest.fn()}
                configData={configDataMock}
            />
        );

        const container = screenReal.getByTestId("memory-models-svg");
        const svgElement = container.querySelector("svg");
        expect(svgElement).not.toBeNull();

        const idText = getIdTextElement(svgElement, "id13");
        const objectBox = svgElement.querySelector("#object-1");
        expect(objectBox).not.toBeNull();
        expect(objectBox.classList.contains("highlighted")).toBe(false);

        fireEventReal.mouseOver(idText);
        expect(objectBox.classList.contains("highlighted")).toBe(true);

        fireEventReal.mouseOut(idText);
        expect(objectBox.classList.contains("highlighted")).toBe(false);
    });
});
