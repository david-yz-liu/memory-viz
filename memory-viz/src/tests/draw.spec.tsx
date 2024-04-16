import exports from "../index";
const { MemoryModel, draw } = exports;

describe("draw function", () => {
    it("should produce consistent svg when provided seed", () => {
        const objects: Array<Object> = [
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
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });
});
