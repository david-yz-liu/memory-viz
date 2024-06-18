const { exec } = require("child_process");
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

        exec(`memory-viz ${filePath}`, (err) => {
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
        command: "memory-viz",
        expectedErrorMessage:
            `Command failed: memory-viz\n` +
            `Error: wrong number of arguments.\n` +
            `Usage: memory-viz <path-to-file>\n`,
    },
    {
        errorType: "non-existent file",
        command: "memory-viz cli-test.json",
        expectedErrorMessage:
            `Command failed: memory-viz cli-test.json\n` +
            `Error: File ${path.resolve(
                process.cwd(),
                "cli-test.json"
            )} does not exist.\n`,
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
                command = `memory-viz ${filePath}`;
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
