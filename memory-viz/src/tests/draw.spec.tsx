import exports from "../index";
const { MemoryModel, draw } = exports;
const { exec, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const tmp = require("tmp");

tmp.setGracefulCleanup();

describe("memory-viz cli", () => {
    it("should produce an svg that matches snapshot", (done) => {
        const tmpFile = tmp.fileSync({ postfix: ".json" });
        const filePath = tmpFile.name;
        const input = JSON.stringify(
            [
                {
                    type: "str",
                    id: 19,
                    value: "David is cool!",
                    style: ["highlight"],
                },
            ],
            null
        );

        fs.writeFileSync(filePath, input);

        exec(`npx memory-viz ${filePath}`, (err) => {
            if (err) throw err;
            const svgFilePath = path.resolve(
                process.cwd(),
                path.basename(filePath.replace(".json", ".svg"))
            );
            const fileContent = fs.readFileSync(svgFilePath, "utf8");
            expect(fileContent).toMatchSnapshot();
            fs.unlinkSync(svgFilePath);
            done();
        });
    });
});

describe.each([
    {
        errorType: "invalid arguments",
        command: "npx memory-viz",
        expectedErrorMessage:
            `Command failed: npx memory-viz\n` +
            `Error: wrong number of arguments.\n` +
            `Proper input: npx memory-viz <path-to-file>\n`,
    },
    {
        errorType: "non-existent file",
        command: "npx memory-viz cli-test.json",
        expectedErrorMessage:
            `Command failed: npx memory-viz cli-test.json\n` +
            `Error: File ${path.resolve(
                process.cwd(),
                "cli-test.json"
            )} does not exist.\n`,
    },
    {
        errorType: "invalid file type",
        expectedErrorMessage: "is not a JSON file.",
    },
    {
        errorType: "invalid json",
        expectedErrorMessage: "Error: Invalid JSON.",
    },
    {
        errorType: "invalid memory-viz json",
        expectedErrorMessage:
            "This is valid JSON but not valid Memory Models JSON." +
            "Please refer to the repo for more details.",
    },
])(
    "these incorrect inputs to the memory-viz cli",
    ({ errorType, command = undefined, expectedErrorMessage }) => {
        it(`should display ${errorType} error`, (done) => {
            const fileMockingTests = [
                "invalid file type",
                "invalid json",
                "invalid memory-viz json",
            ];

            let filePath: string;
            if (fileMockingTests.includes(errorType)) {
                let err_postfix: string;
                if (errorType === "invalid file type") {
                    err_postfix = ".js";
                } else {
                    err_postfix = ".json";
                }
                const tmpFile = tmp.fileSync({ postfix: err_postfix });
                filePath = tmpFile.name;

                if (errorType === "invalid json") {
                    fs.writeFileSync(filePath, "[1, 2, 3, 4,]");
                } else {
                    fs.writeFileSync(
                        filePath,
                        '[{ "name": "int", "id": 13, "value": 7 }]'
                    );
                }
            }

            if (fileMockingTests.includes(errorType)) {
                command = `npx memory-viz ${filePath}`;
            }
            exec(command, (err) => {
                if (err) {
                    expect(err.code).toBe(1);
                    expect(err.message).toContain(expectedErrorMessage);
                }
                done();
            });
        });
    }
);

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
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a bool", () => {
        const objects: Array<Object> = [{ type: "bool", id: 32, value: true }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an int", () => {
        const objects: Array<Object> = [{ type: "int", id: 32, value: 7 }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders a float", () => {
        const objects: Array<Object> = [{ type: "float", id: 32, value: 7.0 }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty set", () => {
        const objects: Array<Object> = [{ type: "set", id: 32, value: [] }];
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
                type: "list",
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
            { type: "list", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty list", () => {
        const objects: Array<Object> = [{ type: "list", id: 32, value: [] }];
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
                type: "tuple",
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
            { type: "tuple", id: 32, value: [10, 11, 12] },
        ];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });

    it("renders an empty tuple", () => {
        const objects: Array<Object> = [{ type: "tuple", id: 32, value: [] }];
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
                type: "dict",
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
        const objects: Array<Object> = [{ type: "dict", id: 32, value: {} }];
        const m: InstanceType<typeof MemoryModel> = draw(objects, true, {
            width: 1300,
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
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
            seed: 12345,
        });
        const svg: String = m.serializeSVG();
        expect(svg).toMatchSnapshot();
    });
});
