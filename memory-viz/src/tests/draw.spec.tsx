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

    it("renders a bool", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "bool", id: 32, value: true },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an int", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "int", id: 32, value: 7 },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a str", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "str", id: 32, value: "winter" },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a set", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "set", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a list with indexes showing", () => {
        const objects: Array<Object> = [
            {
                isClass: false,
                name: "list",
                id: 32,
                value: [10, 11, 12],
                show_indexes: true,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a tuple without indexes showing", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "tuple", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a dict", () => {
        const objects: Array<Object> = [
            {
                isClass: false,
                name: "dict",
                id: 10,
                value: { x: 81, y: 100, z: 121 },
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an object with no type and no value", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "None", id: 13, value: "None" },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a blank space", () => {
        const objects: Array<Object> = [
            { name: "BLANK", width: 100, height: 200 },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a stack frame and an int", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    my_int: 13,
                },
                stack_frame: true,
            },
            {
                isClass: false,
                name: "int",
                id: 13,
                value: 7,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a stack frame using manual layout", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                x: 200,
                y: 200,
                name: "__main__",
                id: null,
                value: {
                    lst1: 82,
                    lst2: 84,
                },
                stack_frame: true,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, false, {
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a bool using manual layout", () => {
        const objects: Array<Object> = [
            {
                isClass: false,
                x: 750,
                y: 250,
                name: "bool",
                id: 32,
                value: true,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, false, {
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });
});
