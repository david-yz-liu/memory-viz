import { jest } from "@jest/globals";
import exports from "../index.js";
import { DrawnEntity } from "../types.js";
const { draw } = exports;

describe("draw function", () => {
    test.each([
        {
            test: "should produce consistent svg when provided seed",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
                },
                {
                    type: "str",
                    id: 99,
                    value: "David is cool!",
                    style: ["highlight"],
                },
                { type: "int", id: 10, value: 7 },
                { type: "int", id: 82 },
                { type: "int", id: 84 },
                { type: "int", id: 11 },
            ],
        },
        {
            test: "renders a bool",
            input: [{ type: "bool", id: 32, value: true }],
        },
        { test: "renders an int", input: [{ type: "int", id: 32, value: 7 }] },
        {
            test: "renders a float",
            input: [{ type: "float", id: 32, value: 7.0 }],
        },
        {
            test: "renders a str",
            input: [{ type: "str", id: 32, value: "winter" }],
        },
        {
            test: "renders a bool with null value",
            input: [{ type: "bool", id: 10, value: null }],
        },
        {
            test: "renders a bool without defining the value",
            input: [{ type: "bool", id: 10 }],
        },
        {
            test: "renders an int with null value",
            input: [{ type: "int", id: 10, value: null }],
        },
        {
            test: "renders an int without defining the value",
            input: [{ type: "int", id: 10 }],
        },
        {
            test: "renders a float with null value",
            input: [{ type: "float", id: 10, value: null }],
        },
        {
            test: "renders a float without defining the value",
            input: [{ type: "float", id: 10 }],
        },
        {
            test: "renders a float preserving all decimals",
            input: [{ type: "float", id: 10, value: 1.234 }],
        },
        {
            test: "renders a str with null value",
            input: [{ type: "str", id: 10, value: null }],
        },
        {
            test: "renders a str without defining the value",
            input: [{ type: "str", id: 10 }],
        },
        {
            test: "renders a set",
            input: [
                { type: "set", id: 32, value: [10, 11, 12] },
                { type: "int", id: 10 },
                { type: "int", id: 11 },
                { type: "int", id: 12 },
            ],
        },
        {
            test: "renders an empty set",
            input: [{ type: "set", id: 32, value: [] }],
        },
        {
            test: "renders a set with null values",
            input: [{ type: "set", id: 32, value: [null, null, null] }],
        },
        {
            test: "renders a set with null and valid values",
            input: [
                { type: "set", id: 32, value: [null, 1, 2] },
                { type: "int", id: 1 },
                { type: "int", id: 2 },
            ],
        },
        {
            test: "renders a set with styling specific indices",
            input: [
                {
                    type: "set",
                    id: 32,
                    value: [5, 10, 20],
                    style: {
                        box_compound: { "0": { fill: "red" } },
                        text_compound: { "1": { "font-style": "italic" } },
                    },
                },
                { type: "int", id: 5 },
                { type: "int", id: 10 },
                { type: "int", id: 20 },
            ],
        },
        {
            test: "renders a list with indexes showing",
            input: [
                {
                    type: "list",
                    id: 32,
                    value: [10, 11, 12],
                    show_indexes: true,
                },
                { type: "int", id: 10 },
                { type: "int", id: 11 },
                { type: "int", id: 12 },
            ],
        },
        {
            test: "renders a list without indexes showing",
            input: [
                { type: "list", id: 32, value: [10, 11, 12] },
                { type: "int", id: 10 },
                { type: "int", id: 11 },
                { type: "int", id: 12 },
            ],
        },
        {
            test: "renders an empty list",
            input: [{ type: "list", id: 32, value: [] }],
        },
        {
            test: "renders a list with null values",
            input: [{ type: "list", id: 32, value: [null, null, null] }],
        },
        {
            test: "renders a list with null and valid values",
            input: [
                { type: "list", id: 32, value: [null, 1, 2] },
                { type: "int", id: 1 },
                { type: "int", id: 2 },
            ],
        },
        {
            test: "renders a list with styling specific indices",
            input: [
                {
                    type: "list",
                    id: 32,
                    value: [null, 10, 20],
                    style: {
                        box_compound: { "2": { fill: "red" } },
                        text_compound: { "1": { "font-style": "italic" } },
                    },
                },
                { type: "int", id: 10 },
                { type: "int", id: 20 },
            ],
        },
        {
            test: "renders a tuple with indexes showing",
            input: [
                {
                    type: "tuple",
                    id: 32,
                    value: [10, 11, 12],
                    show_indexes: true,
                },
                { type: "int", id: 10 },
                { type: "int", id: 11 },
                { type: "int", id: 12 },
            ],
        },
        {
            test: "renders a tuple without indexes showing",
            input: [
                { type: "tuple", id: 32, value: [10, 11, 12] },
                { type: "int", id: 10 },
                { type: "int", id: 11 },
                { type: "int", id: 12 },
            ],
        },
        {
            test: "renders an empty tuple",
            input: [{ type: "tuple", id: 32, value: [] }],
        },
        {
            test: "renders a tuple with null values",
            input: [{ type: "tuple", id: 32, value: [null, null, null] }],
        },
        {
            test: "renders a tuple with null and valid values",
            input: [
                { type: "tuple", id: 32, value: [null, 1, 2] },
                { type: "int", id: 1 },
                { type: "int", id: 2 },
            ],
        },
        {
            test: "renders a dict",
            input: [
                { type: "dict", id: 10, value: { 81: 81, 100: 100, 121: 121 } },
                { type: "int", id: 81 },
                { type: "int", id: 100 },
                { type: "int", id: 121 },
            ],
        },
        {
            test: "renders an empty dict",
            input: [{ type: "dict", id: 10, value: {} }],
        },
        {
            test: "renders dict with empty string key without 'id' prefix",
            input: [
                { type: "dict", id: 10, value: { "": 100, 100: 200 } },
                { type: "int", id: 100 },
                { type: "int", id: 200 },
            ],
        },
        {
            test: "renders dict with space key without 'id' prefix",
            input: [
                { type: "dict", id: 2, value: { " ": 300, 300: 400 } },
                { type: "int", id: 300 },
                { type: "int", id: 400 },
            ],
        },
        {
            test: "renders dict with empty/space keys and null values",
            input: [
                {
                    type: "dict",
                    id: 3,
                    value: { "": null, " ": null, 1: null },
                },
                { type: "int", id: 1 },
            ],
        },
        {
            test: "renders dict with list value",
            input: [
                {
                    type: "dict",
                    id: 3,
                    value: [
                        ["", null],
                        ["", 1],
                        ["0", 2],
                        [" ", 3],
                        [null, 4],
                        [undefined, 5],
                        [0, 6],
                    ],
                },
                { type: "int", id: 0 },
                { type: "int", id: 1 },
                { type: "int", id: 2 },
                { type: "int", id: 4 },
                { type: "int", id: 5 },
                { type: "int", id: 6 },
            ],
        },
        {
            test: "renders dict with custom styling",
            input: [
                {
                    type: "dict",
                    id: 3,
                    value: { "0": 0, "1": 1, "2": 2 },
                    style: {
                        box_container: { fill: "green", fillStyle: "solid" },
                    },
                },
                { type: "int", id: 0 },
                { type: "int", id: 1 },
                { type: "int", id: 2 },
            ],
        },
        {
            test: "renders dict with id and box having different colours",
            input: [
                {
                    type: "dict",
                    id: 3,
                    value: { "0": 0, "1": 1, "2": 2 },
                    style: {
                        box_id: { fill: "black", fillStyle: "solid" },
                        box_container: { fill: "green", fillStyle: "solid" },
                    },
                },
                { type: "int", id: 0 },
                { type: "int", id: 1 },
                { type: "int", id: 2 },
            ],
        },
        {
            test: "renders a dict with styling specific keys and values",
            input: [
                {
                    type: "dict",
                    id: 32,
                    value: { "5": 10, "6": 20, "7": 30 },
                    style: {
                        box_compound: {
                            "0": { key: { fill: "red" } },
                            "1": { value: { fill: "green" } },
                        },
                        text_compound: {
                            "2": {
                                key: { "font-style": "italic" },
                                value: { "font-style": "italic" },
                            },
                        },
                    },
                },
                { type: "int", id: 5 },
                { type: "int", id: 6 },
                { type: "int", id: 7 },
                { type: "int", id: 10 },
                { type: "int", id: 20 },
                { type: "int", id: 30 },
            ],
        },
        {
            test: "renders an object with no type and no value",
            input: [{ type: "None", id: 13, value: "None" }],
        },
        {
            test: "renders a blank space",
            input: [{ type: ".blank", width: 100, height: 200 }],
        },
        {
            test: "renders an object with defined size",
            input: [{ type: "int", width: 500, height: 500 }],
        },
        {
            test: "renders a dict with large height",
            input: [
                {
                    type: "dict",
                    id: 10,
                    value: { 81: 81, 100: 100, 121: 121 },
                    height: 600,
                },
                { type: "int", id: 81 },
                { type: "int", id: 100 },
                { type: "int", id: 121 },
            ],
        },
        {
            test: "renders a set with large width",
            input: [
                { type: "set", id: 32, value: [10, 11, 12], width: 500 },
                { type: "int", id: 10 },
                { type: "int", id: 11 },
                { type: "int", id: 12 },
            ],
        },
        {
            test: "renders a stack frame and an int",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { my_int: 13 },
                },
                { type: "int", id: 13, value: 7 },
            ],
        },
        {
            test: "renders a class",
            input: [
                {
                    type: ".class",
                    name: "my_class",
                    id: 1,
                    value: { name: 10 },
                },
                { type: "int", id: 10 },
            ],
        },
        {
            test: "renders a class with null attribute name using empty string",
            input: [
                { type: ".class", name: "my_class", id: 1, value: { "": 10 } },
                { type: "int", id: 10 },
            ],
        },
        {
            test: "renders a class with null attribute name using whitespaces",
            input: [
                {
                    type: ".class",
                    name: "my_class",
                    id: 1,
                    value: { "      ": 10 },
                },
                { type: "int", id: 10 },
            ],
        },
        {
            test: "renders a blank stack frame",
            input: [
                { type: ".blank-frame", width: 100, height: 200 },
                { type: "list", id: 82, value: [19, 43, 28, 49] },
                { type: "int", id: 19 },
                { type: "int", id: 43 },
                { type: "int", id: 28 },
                { type: "int", id: 49 },
            ],
        },
        {
            test: "renders blank spaces in automatic layout",
            input: [
                { type: "int", id: 98, value: 42 },
                { type: ".blank", width: 100, height: 200 },
                { type: "str", id: 99, value: "life" },
            ],
        },
        {
            test: "formats non-stack frame objects in automatic layout",
            input: [
                { type: "int", id: 19, value: 42 },
                { type: ".class", name: "fruit", id: 23, value: { name: 12 } },
                { type: "list", id: 54, value: [19, 42, 22, 63] },
                { type: "str", id: 12, value: "banana" },
                { type: "int", id: 42 },
                { type: "int", id: 22 },
                { type: "int", id: 63 },
            ],
        },
        {
            test: "formats a mix of stack frame/non-stack frame objects in automatic layout",
            input: [
                { type: ".frame", name: "__main__", id: null, value: { a: 7 } },
                {
                    type: ".frame",
                    name: "func",
                    id: null,
                    value: { x: 1, y: 17 },
                },
                { type: "list", id: 7, value: [17, 8], show_indexes: true },
                { type: "None", id: 8, value: "None" },
                { type: "int", id: 1 },
                { type: "int", id: 17 },
            ],
        },
        {
            test: "renders custom style (without presets)",
            input: [
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
            ],
        },
        {
            test: "renders custom style with CSS keyword font-sizes without crashing",
            input: [
                {
                    type: "list",
                    id: 54,
                    value: [19, 43, 28, 49],
                    style: { text_id: { "font-size": "x-large" } },
                },
                { type: "int", id: 19 },
                { type: "int", id: 43 },
                { type: "int", id: 28 },
                { type: "int", id: 49 },
            ],
        },
        {
            test: "renders custom style with bare string preset",
            input: [
                {
                    type: "str",
                    id: 42,
                    value: "highlight with string",
                    style: "highlight",
                },
            ],
        },
        {
            test: "renders 'highlight' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["highlight"],
                },
                {
                    type: "str",
                    id: 45,
                    value: "highlight!",
                    style: ["highlight"],
                },
            ],
        },
        {
            test: "renders 'highlight_id' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["highlight_id"],
                },
                {
                    type: "str",
                    id: 45,
                    value: "highlight id!",
                    style: ["highlight_id"],
                },
            ],
        },
        {
            test: "renders 'highlight_type' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["highlight_type"],
                },
                {
                    type: "str",
                    id: 45,
                    value: "highlight type!",
                    style: ["highlight_type"],
                },
            ],
        },
        {
            test: "renders 'hide' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["hide"],
                },
                { type: "str", id: 45, value: "hide!", style: ["hide"] },
            ],
        },
        {
            test: "renders 'hide_id' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["hide_id"],
                },
                { type: "str", id: 45, value: "hide id!", style: ["hide_id"] },
            ],
        },
        {
            test: "renders 'hide_container' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["hide_container"],
                },
                {
                    type: "str",
                    id: 45,
                    value: "hide container!",
                    style: ["hide_container"],
                },
            ],
        },
        {
            test: "renders 'fade' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["fade"],
                },
                { type: "str", id: 45, value: "fade!", style: ["fade"] },
            ],
        },
        {
            test: "renders 'fade_type' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["fade_type"],
                },
                {
                    type: "str",
                    id: 45,
                    value: "fade_type!",
                    style: ["fade_type"],
                },
            ],
        },
        {
            test: "renders 'fade_id' style preset",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["fade_id"],
                },
                { type: "str", id: 45, value: "fade id!", style: ["fade_id"] },
            ],
        },
        {
            test: "renders combinations of style presets",
            input: [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: { item: 45 },
                    style: ["highlight", "fade", "hide_id"],
                },
                {
                    type: "str",
                    id: 45,
                    value: "combination!",
                    style: ["hide_id", "highlight_type"],
                },
            ],
        },
        {
            test: "renders range object",
            input: [{ type: "range", id: 42, value: "range(1, 5)" }],
        },
        {
            test: "renders a complex object",
            input: [{ type: "complex", id: 32, value: "(3+1j)" }],
        },
        {
            test: "renders a complex object, given a null input value",
            input: [{ type: "complex", id: 32, value: null }],
        },
        {
            test: "renders a range object, given a null input value",
            input: [{ type: "range", id: 32, value: null }],
        },
        {
            test: "renders a bytes object",
            input: [{ type: "bytes", id: 32, value: "b'\x00\x00'" }],
        },
        {
            test: "renders a bytes object, when given a null value",
            input: [{ type: "bytes", id: 32, value: null }],
        },
        {
            test: "renders a date object",
            input: [{ type: "date", id: 32, value: "2019-12-04" }],
        },
        {
            test: "renders a date object, when given a null value",
            input: [{ type: "date", id: 32, value: null }],
        },
        {
            test: "renders a frozenset",
            input: [
                { type: "frozenset", id: 32, value: [10, 11, 12] },
                { type: "int", id: 10 },
                { type: "int", id: 11 },
                { type: "int", id: 12 },
            ],
        },
        {
            test: "renders an empty frozenset",
            input: [{ type: "frozenset", id: 32, value: [] }],
        },
        {
            test: "renders a frozenset with null values",
            input: [{ type: "frozenset", id: 32, value: [null, null, null] }],
        },
        {
            test: "renders a frozenset with null and valid values",
            input: [
                { type: "frozenset", id: 32, value: [null, 1, 2] },
                { type: "int", id: 1 },
                { type: "int", id: 2 },
            ],
        },
        {
            test: "renders a frozenset with styling specific indices",
            input: [
                {
                    type: "frozenset",
                    id: 32,
                    value: [5, 10, 20],
                    style: {
                        box_compound: { "0": { fill: "red" } },
                        text_compound: { "1": { "font-style": "italic" } },
                    },
                },
                { type: "int", id: 5 },
                { type: "int", id: 10 },
                { type: "int", id: 20 },
            ],
        },
        {
            test: "renders a stack frame using manual layout",
            input: [
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
                    width: 198,
                },
                { type: "int", id: 82 },
                { type: "int", id: 84 },
            ],
            config: {
                roughjs_config: { options: { seed: 12345 } },
            },
        },
        {
            test: "renders a bool using manual layout",
            input: [
                {
                    x: 750,
                    y: 250,
                    type: "bool",
                    id: 32,
                    value: true,
                },
            ],
            config: {
                roughjs_config: { options: { seed: 12345 } },
            },
        },
        {
            test: "renders diagrams with provided roughjs_config 'fill' option",
            input: [{ type: "str", id: 42, value: "hello" }],
            config: {
                width: 1300,
                roughjs_config: {
                    options: {
                        fill: "red",
                        seed: 12345,
                    },
                },
            },
        },
        {
            test: "renders diagrams with provided roughjs_config 'fill' and 'fillStyle' options",
            input: [{ type: "str", id: 42, value: "hello" }],
            config: {
                width: 1300,
                roughjs_config: {
                    options: {
                        fill: "green",
                        fillStyle: "dashed",
                        seed: 12345,
                    },
                },
            },
        },
        {
            test: "renders diagrams with provided roughjs_config 'roughness' option",
            input: [{ type: "str", id: 42, value: "hello" }],
            config: {
                width: 1300,
                roughjs_config: {
                    options: {
                        roughness: 4,
                        seed: 12345,
                    },
                },
            },
        },
        {
            test: "renders diagrams with provided mix of roughjs_config options",
            input: [{ type: "str", id: 42, value: "hello" }],
            config: {
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
            },
        },
    ])(
        "$test",
        ({
            input,
            config = {
                width: 1300,
                roughjs_config: { options: { seed: 12345 } },
            },
        }) => {
            const objects: DrawnEntity[] = input;
            const m: InstanceType<typeof exports.MemoryModel> = draw(
                objects,
                true,
                config
            );
            const svg: string = m.serializeSVG();
            expect(svg).toMatchSnapshot();
        }
    );

    test.each([
        { type: "set" },
        { type: "list" },
        { type: "tuple" },
        { type: "frozenset" },
    ])("does not render a $type containing strings", ({ type }) => {
        const objects: DrawnEntity[] = [
            { type, id: 32, value: ["hello", "world"] },
        ];
        const warning = new RegExp(
            "^WARNING: id \\D+ is referenced by an object of type \\D+, but has no corresponding object."
        );
        const consoleWarn = console.warn;
        const spy = jest
            .spyOn(global.console, "warn")
            .mockImplementation((msg) => {
                if (!warning.test(msg)) {
                    consoleWarn(msg);
                }
            });

        const errorMessage = `Invalid type or value: Expected a collection type (dict, set, list, tuple, frozenset) or a primitive value, but received type "${objects[0].type}" with value "${objects[0].value}".`;
        expect(() =>
            draw(objects, true, {
                width: 1300,
                roughjs_config: { options: { seed: 12345 } },
            })
        ).toThrow(errorMessage);
        spy.mockRestore();
    });

    it("throws an error when object type is not a collection and value is not a primitive", () => {
        const objects: DrawnEntity[] = [
            {
                type: "invalid collection",
                id: 0,
                value: [1, 2],
            },
            { type: "int", id: 1 },
            { type: "int", id: 2 },
        ];

        const errorMessage = `Invalid type or value: Expected a collection type (dict, set, list, tuple, frozenset) or a primitive value, but received type "${objects[0].type}" with value "${objects[0].value}".`;
        expect(() =>
            draw(objects, true, {
                width: 100,
            })
        ).toThrow(errorMessage);
    });

    test.each([
        {
            test: "throws error for invalid bare string style preset",
            style: "nonsense",
        },
        {
            test: "throws error for invalid style preset in array",
            style: ["nonsense"],
        },
    ])("$test", ({ style }) => {
        const objects: DrawnEntity[] = [
            { type: "str", id: 42, value: "test", style },
        ];

        expect(() =>
            draw(objects, true, {
                width: 1300,
                roughjs_config: { options: { seed: 12345 } },
            })
        ).toThrow(
            'Style preset "nonsense" not found. Please refer to the documentation for available presets.'
        );
    });

    test.each([
        {
            test: "logs a warning when provided 'small' width value",
            draw_config: { width: 13 },
            warning:
                "^WARNING: provided width \\(\\d+\\) is smaller than " +
                "the required width \\(\\d+(\\.\\d+)?\\). The provided width has been overwritten " +
                "in the generated diagram.$",
        },
        {
            test: "logs a warning when DrawnEntity is provided with a 'small' width value",
            drawn_entity_config: { width: 50 },
            warning:
                "^WARNING: provided width of object \\(\\d+\\) is smaller than " +
                "the required width \\(\\d+(\\.\\d+)?\\). The provided width has been overwritten " +
                "in the generated diagram.$",
        },
        {
            test: "logs a warning when DrawnEntity is provided with a 'small' height value",
            drawn_entity_config: { height: 50 },
            warning:
                "^WARNING: provided height of object \\(\\d+\\) is smaller than " +
                "the required height \\(\\d+\\). The provided height has been overwritten " +
                "in the generated diagram.$",
        },
    ])("$test", ({ drawn_entity_config = {}, draw_config = {}, warning }) => {
        const objects: DrawnEntity[] = [
            {
                type: "str",
                id: 19,
                value: "David is cool!",
                style: ["highlight"],
                ...drawn_entity_config,
            },
        ];
        const spy = jest
            .spyOn(global.console, "warn")
            .mockImplementation(() => {});
        draw(objects, true, {
            ...draw_config,
            roughjs_config: { options: { seed: 12345 } },
        });
        expect(spy).toHaveBeenCalledTimes(1);

        const message = new RegExp(warning);
        expect(message.test(spy.mock.calls[0][0])).toBe(true);
        spy.mockRestore();
    });

    test.each([
        {
            test: "logs a warning when all objects are given the same id",
            input: [
                { type: "int", id: 100, value: 5 },
                { type: "bool", id: 100, value: true },
                { type: "list", id: 100, value: [null] },
            ],
            warnings: ["WARNING: id 100 is used by 3 objects."],
        },
        {
            test: "logs multiple warnings when objects are given different duplicate ids",
            input: [
                { type: "int", id: 100, value: 5 },
                { type: "int", id: 7, value: 10 },
                { type: "float", id: 100, value: 7.3 },
                { type: "str", id: 100, value: "hello" },
                { type: "bool", id: 7, value: true },
                { type: "bool", id: 0, value: false },
            ],
            warnings: [
                "WARNING: id 100 is used by 3 objects.",
                "WARNING: id 7 is used by 2 objects.",
            ],
        },
        {
            test: "logs no warning when all objects are given distinct ids",
            input: [
                { type: "int", id: 1, value: 5 },
                { type: "bool", id: 2, value: true },
                { type: "float", id: 3, value: 7.3 },
            ],
            warnings: [],
        },
        {
            test: "logs no warning when multiple objects are given null ids",
            input: [
                { type: "int", id: null, value: 5 },
                { type: "int", id: null, value: 5 },
            ],
            warnings: [],
        },
        {
            test: "logs no warning when multiple objects are not given ids",
            input: [
                { type: "int", value: 5 },
                { type: "int", value: 5 },
            ],
            warnings: [],
        },
        {
            test: "logs no warning when an object is given the same id as a stack frame",
            input: [
                { type: ".frame", id: 100, value: { "": null } },
                { type: "int", id: 100, value: 5 },
            ],
            warnings: [],
        },
        {
            test: "logs a warning when a list references an id that doesn't correspond to any object",
            input: [
                { type: "list", id: 1, value: [20, 50] },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [
                "WARNING: id 50 is referenced by an object of type list, but has no corresponding object.",
            ],
        },
        {
            test: "logs a warning when a tuple references an id that doesn't correspond to any object",
            input: [
                { type: "tuple", id: 1, value: [20, 50] },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [
                "WARNING: id 50 is referenced by an object of type tuple, but has no corresponding object.",
            ],
        },
        {
            test: "logs a warning when a set references an id that doesn't correspond to any object",
            input: [
                { type: "set", id: 1, value: [20, 50] },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [
                "WARNING: id 50 is referenced by an object of type set, but has no corresponding object.",
            ],
        },
        {
            test: "logs a warning when a dict references an id that doesn't correspond to any object",
            input: [
                { type: "dict", id: 1, value: { x: 10, "50": 20 } },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [
                "WARNING: id x is referenced by an object of type dict, but has no corresponding object.",
                "WARNING: id 10 is referenced by an object of type dict, but has no corresponding object.",
                "WARNING: id 50 is referenced by an object of type dict, but has no corresponding object.",
            ],
        },
        {
            test: "logs a warning when a class references an id that doesn't correspond to any object",
            input: [
                { type: ".class", id: 1, value: { x: 10, "50": 20 } },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [
                "WARNING: id 10 is referenced by an object of type .class, but has no corresponding object.",
            ],
        },
        {
            test: "logs a warning when a stack frame references an id that doesn't correspond to any object",
            input: [
                { type: ".frame", id: 1, value: { x: 10, "50": 20 } },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [
                "WARNING: id 10 is referenced by an object of type .frame, but has no corresponding object.",
            ],
        },
        {
            test: "logs no warning when a dict references a blank id",
            input: [
                { type: "dict", id: 1, value: { "": 20, "    ": 20 } },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [],
        },
        {
            test: "logs no warning when a dict references an existing id as a string representation",
            input: [
                { type: "dict", id: 1, value: { "20": null } },
                { type: "int", id: 20, value: 5 },
            ],
            warnings: [],
        },
        {
            test: "logs no warning when objects reference a null id",
            input: [
                { type: "list", id: 1, value: [null] },
                { type: ".frame", id: 2, value: { x: null } },
            ],
            warnings: [],
        },
        {
            test: "logs a warning when objects reference a stack frame",
            input: [
                { type: "list", id: 1, value: [2] },
                { type: ".frame", id: 2, value: { "": null } },
            ],
            warnings: [
                "WARNING: id 2 is referenced by an object of type list, but has no corresponding object.",
            ],
        },
    ])("$test", ({ input, warnings }) => {
        const objects: DrawnEntity[] = input;
        const spy = jest
            .spyOn(global.console, "warn")
            .mockImplementation(() => {});
        draw(objects, true, {
            roughjs_config: { options: { seed: 12345 } },
        });

        expect(spy).toHaveBeenCalledTimes(warnings.length);
        expect(spy.mock.calls.flat()).toEqual(expect.arrayContaining(warnings));
        spy.mockRestore();
    });

    it("adds unique IDs to object boxes in SVG output", () => {
        const objects: DrawnEntity[] = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: { lst1: 82, lst2: 84 },
            },
            {
                type: "str",
                id: 82,
                value: "David is cool!",
            },
            { type: "int", id: 84, value: 7 },
        ];
        const m: InstanceType<typeof exports.MemoryModel> = draw(
            objects,
            true,
            {
                width: 1300,
                roughjs_config: { options: { seed: 12345 } },
            }
        );
        const svg: string = m.serializeSVG();

        // IDSs are present?
        expect(svg).toContain('id="object-0"');
        expect(svg).toContain('id="object-1"');
        expect(svg).toContain('id="object-2"');

        // IDs are unique?
        const svg_str = svg.toString();
        expect((svg_str.match(/id="object-0"/g) || []).length).toBe(1);
        expect((svg_str.match(/id="object-1"/g) || []).length).toBe(1);
        expect((svg_str.match(/id="object-2"/g) || []).length).toBe(1);

        // Ensure internal rectangles like property boxes don't get IDs
        const objectIdMatches = svg_str.match(/id="object-\d+"/g) || [];
        expect(objectIdMatches.length).toBe(3);
    });

    it("calculates text length correctly for CSS keyword font-sizes", () => {
        const testString = "test";
        const m: InstanceType<typeof exports.MemoryModel> =
            new exports.MemoryModel();

        const mediumLength = m.getTextLength(testString, {
            "font-size": "medium",
        });
        expect(mediumLength).toBe(48);

        const xlargeLength = m.getTextLength(testString, {
            "font-size": "x-large",
        });
        expect(xlargeLength).toBe(72);

        const xxsmallLength = m.getTextLength(testString, {
            "font-size": "xx-small",
        });
        expect(xxsmallLength).toBeCloseTo(28.8);

        const pixelLength = m.getTextLength(testString, {
            "font-size": "16px",
        });
        expect(pixelLength).toBeCloseTo(38.4);

        const defaultLength = m.getTextLength(testString);
        expect(defaultLength).toBe(48);

        const invalidLength = m.getTextLength(testString, {
            "font-size": "invalid",
        });
        expect(invalidLength).toBe(48);
    });

    test.each([
        {
            test: "renders a diagram with 'small' width value and no stack frames",
            input: [
                {
                    type: "str",
                    id: 19,
                    value: "David is cool!",
                    style: ["highlight"],
                },
            ],
        },
        {
            test: "renders a diagram with 'small' width value and a mix stack frame/non-stack frame objects",
            input: [
                { type: ".frame", name: "__main__", id: null, value: { a: 7 } },
                {
                    type: ".frame",
                    name: "func",
                    id: null,
                    value: { x: 1, y: 17 },
                },
                { type: "list", id: 7, value: [17, 8], show_indexes: true },
                {
                    type: "str",
                    id: 8,
                    value: "David is cool!",
                    style: ["highlight"],
                },
                { type: "int", id: 1 },
                { type: "int", id: 17 },
            ],
        },
        {
            test: "renders an appropriately sized box for a very long string",
            input: [
                {
                    id: 1,
                    type: "str",
                    value: "I am a very very very very very very very very very very very very very very very very very very very very very very very very very very very long string",
                },
            ],
        },
        {
            test: "renders an appropriately sized box for a string with the highlight style",
            input: [
                {
                    id: 1,
                    type: "str",
                    value: "I am a very very very very very very very very very very very very very very very very very very very very very very very very very very very long string",
                    style: ["highlight"],
                },
            ],
        },
    ])("$test", ({ input }) => {
        const objects: DrawnEntity[] = input;

        const spy = jest
            .spyOn(global.console, "warn")
            .mockImplementation(() => {});
        const m: InstanceType<typeof exports.MemoryModel> = draw(
            objects,
            true,
            {
                width: 13,
                roughjs_config: { options: { seed: 12345 } },
            }
        );
        const svg: string = m.serializeSVG();
        expect(svg).toMatchSnapshot();
        spy.mockRestore();
    });

    it("renders a diagram with large left margins", () => {
        const objects: DrawnEntity[] = [
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
                id: 7,
                value: [17, 8],
                show_indexes: true,
            },
            {
                type: "str",
                id: 8,
                value: "David is cool!",
                style: ["highlight"],
            },
            { type: "int", id: 1 },
            { type: "int", id: 17 },
        ];
        const spy = jest
            .spyOn(global.console, "warn")
            .mockImplementation(() => {});
        const m: InstanceType<typeof exports.MemoryModel> = draw(
            objects,
            true,
            {
                width: 13,
                left_margin: 150,
                roughjs_config: { options: { seed: 12345 } },
            }
        );
        const svg: string = m.serializeSVG();
        expect(svg).toMatchSnapshot();
        spy.mockRestore();
    });

    it("renders an empty svg given an empty array", () => {
        const objects: DrawnEntity[] = [];
        const output: InstanceType<typeof exports.MemoryModel> = draw(
            objects,
            true,
            {
                width: 100,
                roughjs_config: {
                    options: {
                        seed: 12345,
                    },
                },
            }
        );
        const svg = output.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("trims width when not provided width value", () => {
        const objects: DrawnEntity[] = [
            {
                type: ".frame",
                name: "__main__",
                id: null,
                value: {
                    item: 45,
                },
            },
            {
                type: "str",
                id: 45,
                value: "hi",
                style: ["hide_id"],
            },
        ];
        const m: InstanceType<typeof exports.MemoryModel> = draw(
            objects,
            true,
            {
                roughjs_config: { options: { seed: 12345 } },
            }
        );
        const svg: string = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a list of snapshots", () => {
        const snapshots: DrawnEntity[][] = [
            [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: {
                        item: 1,
                    },
                },
                {
                    type: "str",
                    id: 1,
                    value: "hello world",
                },
            ],
            [
                {
                    type: ".frame",
                    name: "__main__",
                    id: null,
                    value: {
                        item: 1,
                    },
                },
                {
                    type: "str",
                    id: 1,
                    value: "hi world",
                },
            ],
        ];
        const models = draw(snapshots, true, {
            roughjs_config: { options: { seed: 12345 } },
        });

        models.forEach((model) => {
            const svg = model.serializeSVG();
            expect(svg).toMatchSnapshot();
        });
    });

    it("includes script element and css when interactive option is enabled", () => {
        const objects: DrawnEntity[] = [
            {
                type: "str",
                id: 19,
                value: "Interactive test",
            },
            { type: "int", id: 13, value: 7 },
        ];

        const interactiveModel: InstanceType<typeof exports.MemoryModel> = draw(
            objects,
            true,
            {
                width: 1300,
                interactive: true,
                roughjs_config: { options: { seed: 12345 } },
            }
        );
        const interactiveSvg: string = interactiveModel.serializeSVG();

        expect(interactiveSvg).toContain("<script>");
        expect(interactiveSvg).toContain("enableInteractivity");
        expect(interactiveSvg).toContain("idToObjectMap");
        expect(interactiveSvg).toContain(".highlighted path {");
        expect(interactiveSvg).toContain("var(--highlight-object-fill)");
        expect(interactiveSvg).toContain("text.id {");
        expect(interactiveSvg).toContain("cursor: pointer;");

        const nonInteractiveModel: InstanceType<typeof exports.MemoryModel> =
            draw(objects, true, {
                width: 1300,
                interactive: false,
                roughjs_config: { options: { seed: 12345 } },
            });
        const nonInteractiveSvg: string = nonInteractiveModel.serializeSVG();

        expect(nonInteractiveSvg).not.toContain("<script>");
        expect(nonInteractiveSvg).not.toContain("enableInteractivity");
        expect(nonInteractiveSvg).not.toContain("cursor: pointer");

        expect(interactiveSvg).toMatchSnapshot();
        expect(nonInteractiveSvg).toMatchSnapshot();
    });

    test.each([
        {
            test: "assigns sequential object ids to bounding boxes",
            input: [
                { type: "int", id: 10, value: 42 },
                { type: "str", id: 20, value: "test" },
                { type: "list", id: 30, value: [10, 20] },
            ],
            expected_substrings: [
                'id="object-0"',
                'id="object-1"',
                'id="object-2"',
                '"id10":["object-0"]',
                '"id20":["object-1"]',
                '"id30":["object-2"]',
            ],
        },
        {
            test: "generates correct interactive script with proper event mappings",
            input: [
                { type: "str", id: 19, value: "Interactive test" },
                { type: "int", id: 13, value: 7 },
            ],
            expected_substrings: [
                "addEventListener",
                "mouseover",
                "mouseout",
                "highlightObject",
                "removeHighlight",
                "document.querySelectorAll('text.id')",
                "classList.add('highlighted')",
                "classList.remove('highlighted')",
            ],
        },
        {
            test: "handles objects with null ids in interactive mode",
            input: [
                { type: ".frame", name: "__main__", id: null, value: { x: 1 } },
                { type: "int", id: 42, value: 5 },
                { type: "str", id: 99, value: "test" },
                { type: "int", id: 1 },
            ],
            expected_substrings: ['"id42"', '"id99"'],
            unexpected_substrings: ['"idnull"', 'null":'],
        },
        {
            test: "generates interactive script for empty objects array",
            input: [],
            expected_substrings: [
                "<script>",
                "enableInteractivity",
                "const idToObjectMap = {};",
            ],
        },
        {
            test: "renders custom styles correctly in interactive mode",
            input: [
                {
                    type: "str",
                    id: 42,
                    value: "styled interactive",
                    style: ["highlight"],
                },
                { type: "int", id: 99, value: 999, style: ["fade"] },
            ],
            expected_substrings: ['"id42"', '"id99"', "enableInteractivity"],
        },
        {
            test: "maps multiple references to same object id",
            input: [
                { type: "list", id: 1, value: [42, 42, 42] },
                { type: "int", id: 42, value: 5 },
            ],
            expected_substrings: ['"id42"', '"id1"', "object-0", "object-1"],
        },
    ])(
        "$test",
        ({ input, expected_substrings = [], unexpected_substrings = [] }) => {
            const objects: DrawnEntity[] = input;

            const m: InstanceType<typeof exports.MemoryModel> = draw(
                objects,
                true,
                {
                    width: 1300,
                    interactive: true,
                    roughjs_config: { options: { seed: 12345 } },
                }
            );
            const svg: string = m.serializeSVG();

            for (const substring of expected_substrings) {
                expect(svg).toContain(substring);
            }
            for (const substring of unexpected_substrings) {
                expect(svg).not.toContain(substring);
            }
            expect(svg).toMatchSnapshot();
        }
    );

    it("works at highlighting interactively with different themes", () => {
        const objects: DrawnEntity[] = [
            { type: "str", id: 42, value: "themed" },
            { type: "int", id: 99, value: 5 },
        ];

        const darkModel: InstanceType<typeof exports.MemoryModel> = draw(
            objects,
            true,
            {
                width: 1300,
                interactive: true,
                theme: "dark",
                roughjs_config: { options: { seed: 12345 } },
            }
        );
        const darkSvg: string = darkModel.serializeSVG();

        expect(darkSvg).toContain('data-theme="dark"');
        expect(darkSvg).toContain("--highlight-object-fill");
        expect(darkSvg).toContain("enableInteractivity");

        const highContrastModel: InstanceType<typeof exports.MemoryModel> =
            draw(objects, true, {
                width: 1300,
                interactive: true,
                theme: "high-contrast",
                roughjs_config: { options: { seed: 12345 } },
            });
        const highContrastSvg: string = highContrastModel.serializeSVG();

        expect(highContrastSvg).toContain('data-theme="high-contrast"');
        expect(highContrastSvg).toContain("--highlight-object-fill");
        expect(darkSvg).toMatchSnapshot();
        expect(highContrastSvg).toMatchSnapshot();
    });
});
