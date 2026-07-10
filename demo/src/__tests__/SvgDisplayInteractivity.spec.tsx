import { jest } from "@jest/globals";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import SvgDisplay from "../SvgDisplay.js";

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

describe("SvgDisplay hover interactivity (real memory-viz)", () => {
    const jsonResult = [
        { type: ".frame", name: "__main__", value: { x: 13 } },
        { type: "int", id: 13, value: 7 },
    ];
    const configDataMock = {
        overallDrawConfig: { seed: 1234 },
    };

    it("highlights the referenced object's box on hover and un-highlights it on mouseout", () => {
        render(
            <SvgDisplay
                jsonResult={jsonResult}
                setSvgResult={jest.fn()}
                setFailureBanner={jest.fn()}
                setIsValidJson={jest.fn()}
                configData={configDataMock}
            />
        );

        const container = screen.getByTestId("memory-models-svg");
        const svgElement = container.querySelector("svg");
        expect(svgElement).not.toBeNull();

        const idText = getIdTextElement(svgElement, "id13");
        const objectBox = svgElement.querySelector("#object-1");
        expect(objectBox).not.toBeNull();
        expect(objectBox.classList.contains("highlighted")).toBe(false);

        fireEvent.mouseOver(idText);
        expect(objectBox.classList.contains("highlighted")).toBe(true);

        fireEvent.mouseOut(idText);
        expect(objectBox.classList.contains("highlighted")).toBe(false);
    });
});
