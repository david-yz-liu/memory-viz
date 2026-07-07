import { jest } from "@jest/globals";
import React from "react";

const SERIALIZED_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="900"><rect id="object-0" /></svg>';

const mockMemoryModels = {
    serializeSVG: jest.fn(() => SERIALIZED_SVG),
    createInteractiveSVGElement: jest.fn(() => {
        const svgElement = new DOMParser().parseFromString(
            SERIALIZED_SVG,
            "image/svg+xml"
        ).documentElement as unknown as SVGSVGElement;
        svgElement.setAttribute("viewBox", "0 0 1300 900");
        svgElement.setAttribute("preserveAspectRatio", "xMinYMin meet");
        svgElement.style.width = "100%";
        svgElement.style.height = "100%";
        return svgElement;
    }),
    height: 1000,
};

jest.unstable_mockModule("memory-viz", () => ({
    default: {
        draw: jest.fn(() => mockMemoryModels),
    },
}));

import { render, screen } from "@testing-library/react";

const { default: SvgDisplay } = await import("../SvgDisplay.js");
const mem = await import("memory-viz");
const { draw } = mem.default;

describe("SvgDisplay", () => {
    const setSvgResultMock = jest.fn();
    const setFailureBannerMock = jest.fn();
    const setIsValidJsonMock = jest.fn();
    const seedMock = 1234;
    const configDataMock = {
        overallDrawConfig: {
            seed: seedMock,
        },
    };
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
            const svgElement = container.shadowRoot.querySelector("svg");
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

    it("does not render any diagrams when jsonResult is null", () => {
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
        expect(container.shadowRoot).toBeNull();
    });
});
