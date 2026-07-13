/**
 * @jest-environment jsdom
 */
import exports from "../index.js";
import { MemoryModel } from "../memory_model.js";

const { draw } = exports;

const fireEvent = {
    mouseOver: (el: Element) =>
        el.dispatchEvent(new Event("mouseover", { bubbles: true })),
    mouseOut: (el: Element) =>
        el.dispatchEvent(new Event("mouseout", { bubbles: true })),
};

// Mirrors what a live-DOM consumer (e.g. the demo's SvgDisplay component)
// does with the two public APIs: parse the serialized SVG into a live
// element, then attach real hover listeners to it. Interactivity is only
// attached when the model was drawn with `interactive: true`, matching the
// behaviour of the removed `createInteractiveSVGElement` convenience method.
function renderInteractiveSVG(model: MemoryModel): SVGSVGElement {
    const svg = new DOMParser().parseFromString(
        model.serializeSVG(),
        "image/svg+xml"
    ).documentElement as unknown as SVGSVGElement;

    if (model.interactive) {
        model.attachInteractivity(svg);
    }

    return svg;
}

function getIdTextElement(svg: SVGSVGElement, idValue: string): SVGTextElement {
    const idTextElements = Array.from(svg.querySelectorAll("text.id"));
    const match = idTextElements.find((el) => {
        const textNode = Array.from(el.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE
        );
        return textNode?.nodeValue?.trim() === idValue;
    });
    if (!match) {
        throw new Error(`Could not find text.id element for ${idValue}`);
    }
    return match as unknown as SVGTextElement;
}

describe("hover interactivity", () => {
    it("adds the highlighted class to the matching object box on hover, and removes it on mouseout", () => {
        const model = draw([{ type: "int", id: 13, value: 7 }], {
            width: 1300,
            interactive: true,
        });
        const svg = renderInteractiveSVG(model);

        const idText = getIdTextElement(svg, "id13");
        const objectBox = svg.querySelector("#object-0");
        expect(objectBox.classList.contains("highlighted")).toBe(false);

        fireEvent.mouseOver(idText);
        expect(objectBox.classList.contains("highlighted")).toBe(true);

        fireEvent.mouseOut(idText);
        expect(objectBox.classList.contains("highlighted")).toBe(false);
    });

    it("highlights every object box mapped to the same id", () => {
        // Duplicate ids are user error, but memory-viz still renders both
        // objects and maps id19 to both of their bounding boxes.
        const model = draw(
            [
                { type: "int", id: 19, value: 1 },
                { type: "str", id: 19, value: "dup" },
            ],
            {
                width: 1300,
                interactive: true,
            }
        );
        const svg = renderInteractiveSVG(model);

        const idText = getIdTextElement(svg, "id19");
        const objectBoxes = Array.from(svg.querySelectorAll('[id^="object-"]'));
        expect(objectBoxes.length).toBe(2);

        fireEvent.mouseOver(idText);
        objectBoxes.forEach((box) => {
            expect(box.classList.contains("highlighted")).toBe(true);
        });

        fireEvent.mouseOut(idText);
        objectBoxes.forEach((box) => {
            expect(box.classList.contains("highlighted")).toBe(false);
        });
    });

    it("does not highlight unrelated object boxes", () => {
        const model = draw(
            [
                { type: "int", id: 10, value: 1 },
                { type: "int", id: 20, value: 2 },
            ],
            {
                width: 1300,
                interactive: true,
            }
        );
        const svg = renderInteractiveSVG(model);

        const idText10 = getIdTextElement(svg, "id10");
        const objectBox0 = svg.querySelector("#object-0");
        const objectBox1 = svg.querySelector("#object-1");

        fireEvent.mouseOver(idText10);
        expect(objectBox0.classList.contains("highlighted")).toBe(true);
        expect(objectBox1.classList.contains("highlighted")).toBe(false);
    });

    it("does not attach hover listeners when interactive is disabled", () => {
        const model = draw([{ type: "int", id: 13, value: 7 }], {
            width: 1300,
            interactive: false,
        });
        const svg = renderInteractiveSVG(model);

        const idText = getIdTextElement(svg, "id13");
        const objectBox = svg.querySelector("#object-0");

        fireEvent.mouseOver(idText);
        expect(objectBox.classList.contains("highlighted")).toBe(false);
    });

    it("does not throw or highlight anything when hovering a dangling id reference", () => {
        // The list references id 999, which has no corresponding drawn object,
        // so its "text.id" element has no entry in idToObjectMap.
        const model = draw([{ type: "list", id: 1, value: [999] }], {
            width: 1300,
            interactive: true,
        });
        const svg = renderInteractiveSVG(model);
        const idText = getIdTextElement(svg, "id999");

        expect(() => fireEvent.mouseOver(idText)).not.toThrow();
        expect(() => fireEvent.mouseOut(idText)).not.toThrow();
        expect(svg.querySelectorAll(".highlighted").length).toBe(0);
    });
});
