#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");
const { program } = require("commander");
const readline = require("readline");

function parseFilePath(input) {
    if (input) {
        return pathExists(input, `File`);
    } else {
        return undefined;
    }
}

function parseOutputPath(input) {
    return pathExists(input, `Output path`);
}

// helper function for parsing paths
function pathExists(inputPath, errMsg) {
    const fullPath = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`Error: ${errMsg} ${fullPath} does not exist.`);
        process.exit(1);
    } else {
        return fullPath;
    }
}

function parseRoughjsConfig(input) {
    const pairs = input.split(",");
    const keyValuePairs = pairs.map((pair) => pair.split("="));
    return Object.fromEntries(keyValuePairs);
}

program
    .description(
        "Command line interface for generating memory model diagrams with MemoryViz"
    )
    .argument(
        "[filePath]",
        "path to a file containing MemoryViz-compatible JSON",
        parseFilePath
    )
    .option(
        "--output <path>",
        "writes generated SVG to specified path",
        parseOutputPath
    )
    .option("--width <value>", "width of generated SVG", "1300")
    .option("--height <value>", "height of generated SVG")
    .option(
        "--roughjs-config <key1=value1,key2=value2,...>",
        "options to configure how the SVG is drawn" +
            " - refer to rough.js documentation for available options",
        parseRoughjsConfig
    );

program.parse();
const filePath = program.processedArgs[0];
const options = program.opts();

let jsonContent = "";

if (filePath) {
    // rl.close();
    jsonContent = fs.readFileSync(filePath, "utf8");
    runMemoryViz(jsonContent);
} else {
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdin.isTTY ? process.stdout : null,
    // });

    // rl.on("line", (line) => {
    //     jsonContent += line;
    // });

    // rl.on("close", () => {
    //     runMemoryViz(jsonContent);
    // });

    // Option 1
    // process.stdin.on("data", (chunk) => {
    //     if (chunk.includes("\u0004")) {
    //         process.stdin.emit("end");
    //     } else {
    //         jsonContent += chunk;
    //     }
    // });

    // process.stdin.on("end", () => {
    //     process.stdin.pause();
    //     runMemoryViz(jsonContent);
    // });
    // End of option 1

    // Option 2 (Currently cannot signal EOF from terminal)
    async function read(stream) {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks).toString("utf8");
    }

    async function run() {
        const input = await read(process.stdin);
        runMemoryViz(input);
    }

    run();
    // End of option 2
}

function runMemoryViz(jsonContent) {
    let data;
    try {
        data = JSON.parse(jsonContent);
    } catch (err) {
        console.error(`Error: Invalid JSON\n${err.message}.`);
        process.exit(1);
    }

    let m;
    try {
        m = draw(data, true, {
            width: options.width,
            height: options.height,
            roughjs_config: { options: options.roughjsConfig },
        });
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }

    try {
        if (options.output) {
            const outputName = path.parse(options.output).name + ".svg";
            const outputPath = path.join(options.output, outputName);
            m.save(outputPath);
        } else {
            m.save();
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}
