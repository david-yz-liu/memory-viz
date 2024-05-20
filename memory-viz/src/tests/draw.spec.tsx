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

    it("renders a float", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "float", id: 32, value: 7.0 },
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

    it("renders an empty set", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "set", id: 32, value: [] },
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

    it("renders a list without indexes showing", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "list", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty list", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "list", id: 32, value: [] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a tuple with indexes showing", () => {
        const objects: Array<Object> = [
            {
                isClass: false,
                name: "tuple",
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

    it("renders an empty tuple", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "tuple", id: 32, value: [] },
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

    it("renders an empty dict", () => {
        const objects: Array<Object> = [
            { isClass: false, name: "dict", id: 32, value: {} },
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

    it("renders blank spaces in automatic layout", () => {
        const objects: Array<Object> = [
            {
                isClass: false,
                name: "int",
                id: 98,
                value: 42,
            },
            {
                name: "BLANK",
                width: 100,
                height: 200,
            },
            {
                isClass: false,
                name: "str",
                id: 99,
                value: "life",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("formats non-stack frame objects in automatic layout", () => {
        const objects: Array<Object> = [
            {
                isClass: false,
                name: "int",
                id: 98,
                value: 42,
            },
            {
                isClass: true,
                name: "fruit",
                id: 23,
                value: {
                    name: 12,
                },
            },
            {
                isClass: false,
                name: "list",
                id: 54,
                value: [19, 42, 22, 63],
            },
            {
                isClass: false,
                name: "str",
                id: 12,
                value: "banana",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("formats a mix of stack frame/non-stack frame objects in automatic layout", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    a: 7,
                },
                stack_frame: true,
            },
            {
                isClass: true,
                name: "func",
                id: null,
                value: {
                    x: 1,
                    y: 17,
                },
                stack_frame: true,
            },
            {
                isClass: false,
                name: "list",
                id: 84,
                value: [17, 8],
                show_indexes: true,
            },
            {
                isClass: false,
                name: "None",
                id: 10,
                value: "None",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders custom style (without presets)", () => {
        const objects: Array<Object> = [
            {
                isClass: false,
                name: "str",
                id: 19,
                value: "David is cool!",
                style: {
                    text_id: { fill: "yellow" },
                    text_type: { fill: "cyan", "font-size": "large" },
                    text_value: { fill: "black", "font-style": "bold" },
                    box_id: { fill: "red" },
                    box_type: { bowing: 8, stroke: "red", strokeWidth: 3 },
                    box_container: { fill: "green", fillStyle: "zigzag" },
                },
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'highlight' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["highlight"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "highlight!",
                style: ["highlight"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'highlight_id' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["highlight_id"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "highlight id!",
                style: ["highlight_id"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'highlight_type' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["highlight_type"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "highlight type!",
                style: ["highlight_type"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'hide' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["hide"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "hide!",
                style: ["hide"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'hide_id' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["hide_id"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "hide id!",
                style: ["hide_id"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'hide_container' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["hide_container"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "hide container!",
                style: ["hide_container"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'fade' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["fade"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "fade!",
                style: ["fade"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'fade_type' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["fade_type"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "fade_type!",
                style: ["fade_type"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'fade_id' style preset", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["fade_id"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "fade id!",
                style: ["fade_id"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });
    it("renders combinations of style presets", () => {
        const objects: Array<Object> = [
            {
                isClass: true,
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                stack_frame: true,
                style: ["highlight", "fade", "hide_id"],
            },
            {
                isClass: false,
                name: "str",
                id: 42,
                value: "combination!",
                style: ["hide_id", "highlight_type"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });
});
