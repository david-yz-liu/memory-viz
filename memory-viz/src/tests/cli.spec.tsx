const { execa, ExecaError } = require("execa");
type ExecaErrorInstance = InstanceType<typeof ExecaError>;

const path = require("path");
const fs = require("fs");
const tmp = require("tmp");

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

function runProgram(
    args: string[],
    options: { input?: string; shell?: boolean } = {}
) {
    if (options.shell) {
        return execa(args.join(" "), { shell: true, input: options.input });
    }
    return execa("node", ["memory-viz/dist/cli.js", ...args], {
        input: options.input,
    });
}

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
        command: `${filePath} --output=${outputPath} --height=700 --width=1200 --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, and a variety of rough-config",
        command: `${filePath} --output=${outputPath} --roughjs-config seed=12345,fill=red,fillStyle=solid`,
    },
    {
        inputs: "filepath, output, and global style",
        command: `${filePath} --output=${outputPath} --global-style=${globalStylePath} --roughjs-config seed=12345`,
    },
    {
        inputs: "filepath, output, and (shorthand) global style",
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
        inputs: "filepath, output, custom theme, and global style",
        command: `${filePath} --output=${outputPath} --global-style=${customThemePath} --theme=oceanic-light --roughjs-config seed=12345`,
    },
])("memory-viz cli", ({ inputs, command }) => {
    it(`produces consistent svg when provided ${inputs} option(s)`, async () => {
        fs.writeFileSync(filePath, input);
        fs.writeFileSync(globalStylePath, globalStyle);
        fs.writeFileSync(customThemePath, customTheme);

        await runProgram([`node memory-viz/dist/cli.js ${command}`], {
            shell: true,
        });

        const svgFilePath = getSVGPath(command.includes("--output"));
        const fileContent = fs.readFileSync(svgFilePath, "utf8");
        expect(fileContent).toMatchSnapshot();
        fs.unlinkSync(svgFilePath);
    });
});

describe("memory-viz cli", () => {
    it("produces consistent svg when provided filepath and stdout", async () => {
        fs.writeFileSync(filePath, input);

        const { stdout } = await runProgram([
            filePath,
            "--roughjs-config",
            "seed=1234",
        ]);
        expect(stdout).toMatchSnapshot();
    });

    it("produces consistent svg when provided stdin and stdout", async () => {
        const { stdout } = await runProgram(
            [filePath, "--roughjs-config", "seed=1234"],
            { input: input }
        );
        expect(stdout).toMatchSnapshot();
    });

    it("produces consistent svg when provided stdin and output", async () => {
        await runProgram(
            [`--output=${outputPath}`, "--roughjs-config", "seed=1234"],
            { input: input }
        );

        const fileContent = fs.readFileSync(outputPath, "utf8");
        expect(fileContent).toMatchSnapshot();
        fs.unlinkSync(outputPath);
    });
});

describe.each([
    {
        errorType: "nonexistent file",
        command: "node memory-viz/dist/cli.js cli-test.json",
        expectedErrorMessage:
            `Command failed with exit code 1: node memory-viz/dist/cli.js cli-test.json\n` +
            `Error: File ${path.resolve(
                process.cwd(),
                "cli-test.json"
            )} does not exist.`,
    },
    {
        errorType: "nonexistent css file",
        command: `node memory-viz/dist/cli.js ${filePath} --global-style=nonexistent.css`,
        expectedErrorMessage:
            `Command failed with exit code 1: node memory-viz/dist/cli.js ${filePath} --global-style=nonexistent.css\n` +
            `Error: CSS file ${path.resolve(
                process.cwd(),
                "nonexistent.css"
            )} does not exist.`,
    },
    {
        errorType: "unspecified theme",
        command: `node memory-viz/dist/cli.js ${filePath} --theme`,
        expectedErrorMessage:
            `Command failed with exit code 1: node memory-viz/dist/cli.js ${filePath} --theme\n` +
            `error: option '-t, --theme <name>' argument missing`,
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
        it(`should display ${errorType} error`, async () => {
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
                command = `node memory-viz/dist/cli.js ${filePath}`;
            }

            try {
                if (!command) {
                    throw new Error("Command is undefined");
                }
                await runProgram([command], { shell: true });
                throw new Error("Expected command to fail");
            } catch (err) {
                if (!(err instanceof ExecaError)) {
                    throw err;
                }
                expect((err as ExecaErrorInstance).exitCode).toBe(1);
                expect((err as ExecaErrorInstance).message).toContain(
                    expectedErrorMessage
                );
            }
        });
    }
);

describe("memory-viz CLI output path", () => {
    const tempDir = tmp.dirSync().name;

    const timeout = 3000;

    it(
        "should throw an error when the output path is a folder",
        async () => {
            const folderPath = `${tempDir}/`;
            try {
                await runProgram(
                    [`--output=${folderPath}`, "--roughjs-config", "seed=1234"],
                    { input: input }
                );
                throw new Error("Expected command to fail");
            } catch (err) {
                if (!(err instanceof ExecaError)) {
                    throw err;
                }
                expect((err as ExecaErrorInstance).exitCode).toBe(1);
            }
        },
        timeout
    );

    it(
        "should throw an error when the output path is a file in a folder that does not exist",
        async () => {
            const outputPath = "nonexistent/file.svg";
            try {
                await runProgram(
                    [`--output=${outputPath}`, "--roughjs-config", "seed=1234"],
                    { input: input }
                );
                throw new Error("Expected command to fail");
            } catch (err) {
                if (!(err instanceof ExecaError)) {
                    throw err;
                }
                expect((err as ExecaErrorInstance).exitCode).toBe(1);
            }
        },
        timeout
    );

    it(
        "should produce consistent svg when the output path is a file in a directory",
        async () => {
            const outputPath = `${tempDir}/file.svg`;
            await runProgram(
                [`--output=${outputPath}`, "--roughjs-config", "seed=1234"],
                { input: input }
            );

            const fileContent = fs.readFileSync(outputPath, "utf8");
            expect(fileContent).toMatchSnapshot();
            fs.unlinkSync(outputPath);
        },
        timeout
    );

    it(
        "should overwrite existing svg when the output path is a file that exists",
        async () => {
            const outputPath = tmp.fileSync({ postfix: ".svg" });
            await runProgram(
                [
                    `--output=${outputPath.name}`,
                    "--roughjs-config",
                    "seed=1234",
                ],
                { input: input }
            );

            const fileContent = fs.readFileSync(outputPath.name, "utf8");
            expect(fileContent).toMatchSnapshot();
        },
        timeout
    );

    it(
        "should produce consistent svg when the output path is a file",
        async () => {
            const outputPath = "file.svg";

            await runProgram(
                [`--output=${outputPath}`, "--roughjs-config", "seed=1234"],
                { input: input }
            );

            const fileContent = fs.readFileSync(outputPath, "utf8");
            expect(fileContent).toMatchSnapshot();
            fs.unlinkSync(outputPath);
        },
        timeout
    );
});
