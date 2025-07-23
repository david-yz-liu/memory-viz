import { ExecException } from "child_process";

const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const tmp = require("tmp");
const os = require("os");

tmp.setGracefulCleanup();

const tmpFile = tmp.fileSync({ postfix: ".json" });
const filePath = tmpFile.name;
const outputPath = `${tmpFile.name}.svg`;
const globalStylePath = tmp.fileSync({ postfix: ".css" }).name;
const customThemePath = tmp.fileSync({ postfix: ".css" }).name;
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
const globalStyle = `
    svg {
        background-color: #121212;
    }
    
    text {
        font-family: Consolas, Courier;
        font-size: 20px;
    }
`;
const customTheme = `
    [data-theme="oceanic-light"] {
        --highlight-value-text-color: #014f86;
        --highlight-id-text-color: #008c9e;
        --highlight-box-fill: #caf0f8;
        --highlight-box-line-color: #0077b6;
    }
`;
// Helper function for determining the output path of the SVG
const getSVGPath = (isOutputOption: boolean) => {
    if (isOutputOption) {
        return outputPath;
    }
    const directoryPath = process.cwd();
    const fileName = path.basename(filePath.replace(".json", ".svg"));

    return path.resolve(directoryPath, fileName);
};

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
    {
        inputs: "filepath and global style",
        command: `${filePath} --output=${outputPath} --global-style=${globalStylePath} --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath and (shorthand) global style",
        command: `${filePath} --output=${outputPath} -s ${globalStylePath} --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, and theme",
        command: `${filePath} --output=${outputPath} --theme=dark --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, and (shorthand) theme",
        command: `${filePath} --output=${outputPath} -t high-contrast --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, and unspecified theme",
        command: `${filePath} --output=${outputPath} --theme --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, custom theme, and global style",
        command: `${filePath} --output=${outputPath} --global-style=${customThemePath} --theme=oceanic-light --roughjs-config seed=12345`,
    },
])("memory-viz cli", ({ inputs, command }) => {
    it(`produces consistent svg when provided ${inputs} option(s)`, (done) => {
        fs.writeFileSync(filePath, input);
        fs.writeFileSync(globalStylePath, globalStyle);
        fs.writeFileSync(customThemePath, customTheme);

        exec(`memory-viz ${command}`, (err: ExecException | null) => {
            if (err) throw err;

            const svgFilePath = getSVGPath(command.includes("--output"));
            const fileContent = fs.readFileSync(svgFilePath, "utf8");
            expect(fileContent).toMatchSnapshot();
            fs.unlinkSync(svgFilePath);

            done();
        });
    });
});

describe("memory-viz cli", () => {
    it("produces consistent svg when provided filepath and stdout", (done) => {
        fs.writeFileSync(filePath, input);

        exec(
            `memory-viz ${filePath} --roughjs-config seed=1234`,
            (err: unknown | null, stdout: string) => {
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
        child.stdout.on("data", (data: Buffer) => {
            output += data.toString();
        });

        child.on("close", (err: ExecException | null) => {
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

        child.on("close", (err: ExecException | null) => {
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
        errorType: "nonexistent file",
        command: "memory-viz cli-test.json",
        expectedErrorMessage:
            `Command failed: memory-viz cli-test.json\n` +
            `Error: File ${path.resolve(
                process.cwd(),
                "cli-test.json"
            )} does not exist.\n`,
    },
    {
        errorType: "nonexistent css file",
        command: `memory-viz ${filePath} --global-style=nonexistent.css`,
        expectedErrorMessage:
            `Command failed: memory-viz ${filePath} --global-style=nonexistent.css\n` +
            `Error: CSS file ${path.resolve(
                process.cwd(),
                "nonexistent.css"
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
                command = `memory-viz ${filePath}`;
            }

            exec(command, (err: ExecException | null) => {
                if (err) {
                    expect(err.code).toBe(1);
                    expect(err.message).toContain(expectedErrorMessage);
                }
                done();
            });
        });
    }
);

describe("memory-viz CLI output path", () => {
    const tempDir = tmp.dirSync().name;

    const timeout = 3000;

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
            const folderPath = `${tempDir}/`;
            const child = runProgram(folderPath);
            child.on("close", (err: ExecException | null) => {
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
            child.on("close", (err: ExecException | null) => {
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
                fs.unlinkSync(outputPath);
                done();
            });
        },
        timeout
    );

    it(
        "should overwrite existing svg when the output path is a file that exists",
        (done) => {
            const outputPath = tmp.fileSync({ postfix: ".svg" });
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
                fs.unlinkSync(outputPath);
                done();
            });
        },
        timeout
    );
});
