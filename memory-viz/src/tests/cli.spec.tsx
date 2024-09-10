const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const tmp = require("tmp");
const os = require("os");

tmp.setGracefulCleanup();

const tmpFile = tmp.fileSync({ postfix: ".json" });
const filePath = tmpFile.name;
const outputPath = `${tmpFile.name}.svg`;
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

describe.each([
    {
        inputs: "filepath and output",
        command: `${filePath} --output=${outputPath} --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, and width",
        command: `${filePath} --output=${outputPath} --width=700 --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, and height",
        command: `${filePath} --output=${outputPath} --height=700 --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, height, and width",
        command: `${filePath} --output=${outputPath} --height=700 width=1200 --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath and a variety of rough-config",
        command: `${filePath} --output=${outputPath} --roughjs-config seed=12345,fill=red,fillStyle=solid`,
    },
])("memory-viz cli", ({ inputs, command }) => {
    it(`produces consistent svg when provided ${inputs} option(s)`, (done) => {
        fs.writeFileSync(filePath, input);

        exec(`memory-viz ${command}`, (err) => {
            if (err) throw err;

            const fileContent = fs.readFileSync(outputPath, "utf8");
            expect(fileContent).toMatchSnapshot();
            fs.unlinkSync(outputPath);

            done();
        });
    });
});

describe("memory-viz cli", () => {
    it("produces consistent svg when provided filepath and stdout", (done) => {
        fs.writeFileSync(filePath, input);

        exec(
            `memory-viz ${filePath} --roughjs-config seed=1234`,
            (err, stdout) => {
                if (err) throw err;
                expect(stdout).toMatchSnapshot();
                done();
            }
        );
    });

    it("produces consistent svg when provided stdin and stdout", (done) => {
        const command = "memory-viz";
        const args = ["--roughjs-config seed=1234"];

        const child = spawn(command, args, { shell: true });

        child.stdin.write(input);
        child.stdin.end();

        let output = "";
        child.stdout.on("data", (data) => {
            output += data.toString();
        });

        child.on("close", (err) => {
            if (err) throw err;
            expect(output).toMatchSnapshot();
            done();
        });
    });

    it("produces consistent svg when provided stdin and output", (done) => {
        const command = "memory-viz";
        const args = [`--output=${outputPath}`, "--roughjs-config seed=1234"];

        const child = spawn(command, args, { shell: true });

        child.stdin.write(input);
        child.stdin.end();

        child.on("close", (err) => {
            if (err) throw err;

            const fileContent = fs.readFileSync(outputPath, "utf8");
            expect(fileContent).toMatchSnapshot();
            fs.unlinkSync(outputPath);
            done();
        });
    });
});

describe.each([
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
        expectedErrorMessage: "Error: Invalid JSON",
    },
    {
        errorType: "invalid memory-viz json",
        expectedErrorMessage: "Error:",
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

// TODO: move to only using tmp
describe("memory-viz CLI output path", () => {
    const tempDir = tmp.dirSync().name;

    const timeout = 200;

    function runProgram(outputPath: string) {
        const args = [`--output=${outputPath}`, "--roughjs-config seed=1234"];
        const child = spawn("memory-viz", args, { shell: true });
        child.stdin.write(input);
        child.stdin.end();
        return child;
    }

    it(
        "should throw an error when the output path is a folder",
        (done) => {
            const folderPath = tempDir;
            const child = runProgram(folderPath);
            child.on("close", (err) => {
                expect(err).toEqual(1);
                done();
            });
        },
        timeout
    );

    it(
        "should throw an error when the output path is a file in a folder that does not exist",
        (done) => {
            const outputPath = "nonexistent/file.svg";
            const child = runProgram(outputPath);
            child.on("close", (err) => {
                expect(err).toEqual(1);
                done();
            });
        },
        timeout
    );

    it(
        "should produce consistent svg when the output path is a file in a directory",
        (done) => {
            const outputPath = `${tempDir}/file.svg`;
            const child = runProgram(outputPath);
            child.on("close", () => {
                const fileContent = fs.readFileSync(outputPath, "utf8");
                expect(fileContent).toMatchSnapshot();
                done();
            });
        },
        timeout
    );

    it(
        "should overwrite existing svg when the output path is a file that exists",
        (done) => {
            const outputPath = tmp.fileSync({ postfix: ".json" });
            const child = runProgram(outputPath.name);
            child.on("close", () => {
                const fileContent = fs.readFileSync(outputPath.name, "utf8");
                expect(fileContent).toMatchSnapshot();
                done();
            });
        },
        timeout
    );

    it(
        "should produce consistent svg when the output path is a file",
        (done) => {
            const outputPath = "file.svg";
            const child = runProgram(outputPath);
            child.on("close", () => {
                const fileContent = fs.readFileSync(outputPath, "utf8");
                expect(fileContent).toMatchSnapshot();
                done();
            });
        },
        timeout
    );
});
