import { MemoryModel } from "../src/memory_model";
const { draw } = require("../dist/memory_models_rough");

describe("draw function", () => {
    let objects: Array<object>;
    beforeEach(() => {
        objects = [
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
    });

    it("should produce consistent svg when provided seed", () => {
        const m: MemoryModel = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });
});
