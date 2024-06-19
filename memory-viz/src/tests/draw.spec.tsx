import exports from "../index";
const { MemoryModel, draw } = exports;

describe("draw function", () => {
    it("should produce consistent svg when provided seed", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
            },
            {
                type: "str",
                id: 19,
                value: "David is cool!",
                style: ["highlight"],
            },
            { type: "int", id: 13, value: 7 },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a bool", () => {
        const objects: Array<Object> = [{ type: "bool", id: 32, value: true }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an int", () => {
        const objects: Array<Object> = [{ type: "int", id: 32, value: 7 }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a float", () => {
        const objects: Array<Object> = [{ type: "float", id: 32, value: 7.0 }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a str", () => {
        const objects: Array<Object> = [
            { type: "str", id: 32, value: "winter" },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a set", () => {
        const objects: Array<Object> = [
            { type: "set", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty set", () => {
        const objects: Array<Object> = [{ type: "set", id: 32, value: [] }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a list with indexes showing", () => {
        const objects: Array<Object> = [
            {
                type: "list",
                id: 32,
                value: [10, 11, 12],
                show_indexes: true,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a list without indexes showing", () => {
        const objects: Array<Object> = [
            { type: "list", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty list", () => {
        const objects: Array<Object> = [{ type: "list", id: 32, value: [] }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a tuple with indexes showing", () => {
        const objects: Array<Object> = [
            {
                type: "tuple",
                id: 32,
                value: [10, 11, 12],
                show_indexes: true,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a tuple without indexes showing", () => {
        const objects: Array<Object> = [
            { type: "tuple", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty tuple", () => {
        const objects: Array<Object> = [{ type: "tuple", id: 32, value: [] }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a dict", () => {
        const objects: Array<Object> = [
            {
                type: "dict",
                id: 10,
                value: { x: 81, y: 100, z: 121 },
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty dict", () => {
        const objects: Array<Object> = [{ type: "dict", id: 32, value: {} }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an object with no type and no value", () => {
        const objects: Array<Object> = [
            { type: "None", id: 13, value: "None" },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a blank space", () => {
        const objects: Array<Object> = [
            { type: ".blank", width: 100, height: 200 },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a stack frame and an int", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    my_int: 13,
                },
            },
            {
                type: "int",
                id: 13,
                value: 7,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a stack frame using manual layout", () => {
        const objects: Array<Object> = [
            {
                x: 200,
                y: 200,
                name: "__main__",
                type: ".frame",
                id: null,
                value: {
                    lst1: 82,
                    lst2: 84,
                },
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, false, {
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a bool using manual layout", () => {
        const objects: Array<Object> = [
            {
                x: 750,
                y: 250,
                type: "bool",
                id: 32,
                value: true,
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, false, {
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a blank stack frame", () => {
        const objects: Array<Object> = [
            { type: ".blank-frame", width: 100, height: 200 },
            { type: "list", id: 82, value: [19, 43, 28, 49] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders blank spaces in automatic layout", () => {
        const objects: Array<Object> = [
            {
                type: "int",
                id: 98,
                value: 42,
            },
            {
                type: ".blank",
                width: 100,
                height: 200,
            },
            {
                type: "str",
                id: 99,
                value: "life",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("formats non-stack frame objects in automatic layout", () => {
        const objects: Array<Object> = [
            {
                type: "int",
                id: 98,
                value: 42,
            },
            {
                type: ".class",
                name: "fruit",
                id: 23,
                value: {
                    name: 12,
                },
            },
            {
                type: "list",
                id: 54,
                value: [19, 42, 22, 63],
            },
            {
                type: "str",
                id: 12,
                value: "banana",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("formats a mix of stack frame/non-stack frame objects in automatic layout", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    a: 7,
                },
            },
            {
                type: ".frame",
                name: "func",
                id: null,
                value: {
                    x: 1,
                    y: 17,
                },
            },
            {
                type: "list",
                id: 84,
                value: [17, 8],
                show_indexes: true,
            },
            {
                type: "None",
                id: 10,
                value: "None",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders custom style (without presets)", () => {
        const objects: Array<Object> = [
            {
                type: "str",
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
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'highlight' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["highlight"],
            },
            {
                type: "str",
                id: 42,
                value: "highlight!",
                style: ["highlight"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'highlight_id' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["highlight_id"],
            },
            {
                type: "str",
                id: 42,
                value: "highlight id!",
                style: ["highlight_id"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'highlight_type' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["highlight_type"],
            },
            {
                type: "str",
                id: 42,
                value: "highlight type!",
                style: ["highlight_type"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'hide' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["hide"],
            },
            {
                type: "str",
                id: 42,
                value: "hide!",
                style: ["hide"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'hide_id' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["hide_id"],
            },
            {
                type: "str",
                id: 42,
                value: "hide id!",
                style: ["hide_id"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'hide_container' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["hide_container"],
            },
            {
                type: "str",
                id: 42,
                value: "hide container!",
                style: ["hide_container"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'fade' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["fade"],
            },
            {
                type: "str",
                id: 42,
                value: "fade!",
                style: ["fade"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'fade_type' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["fade_type"],
            },
            {
                type: "str",
                id: 42,
                value: "fade_type!",
                style: ["fade_type"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders 'fade_id' style preset", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["fade_id"],
            },
            {
                type: "str",
                id: 42,
                value: "fade id!",
                style: ["fade_id"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders combinations of style presets", () => {
        const objects: Array<Object> = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
                style: ["highlight", "fade", "hide_id"],
            },
            {
                type: "str",
                id: 42,
                value: "combination!",
                style: ["hide_id", "highlight_type"],
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders diagrams with provided roughjs_config 'fill' option", () => {
        const objects: Array<Object> = [
            {
                type: "str",
                id: 42,
                value: "hello",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { fill: "red", seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders diagrams with provided roughjs_config 'fill' and 'fillStyle' options", () => {
        const objects: Array<Object> = [
            {
                type: "str",
                id: 42,
                value: "hello",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: {
                options: { fill: "green", fillStyle: "dashed", seed: 12345 },
            },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders diagrams with provided roughjs_config 'roughness' option", () => {
        const objects: Array<Object> = [
            {
                type: "str",
                id: 42,
                value: "hello",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { roughness: 4, seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders diagrams with provided mix of roughjs_config options", () => {
        const objects: Array<Object> = [
            {
                type: "str",
                id: 42,
                value: "hello",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: {
                options: {
                    roughness: 4,
                    bowing: 5,
                    fill: "blue",
                    fillWeight: 5,
                    seed: 12345,
                },
            },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders range object", () => {
        const objects: Array<Object> = [
            {
                type: "range",
                id: 42,
                value: "range(1, 5)",
            },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            roughjs_config: { options: { seed: 12345 } },
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });
});
