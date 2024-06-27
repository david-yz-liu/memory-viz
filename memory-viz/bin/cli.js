#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");
const { program } = require("commander");

function parseRoughjsConfig(input) {
    let config = {};
    const pairs = input.split(",");

    pairs.forEach((pair) => {
        const [key, val] = pair.split("=");
        config[key] = val;
    });

    return config;
}

program
    .description(
        "Command line interface for generating memory model diagrams with MemoryViz"
    )
    .argument(
        "<filepath>",
        "path to a file containing MemoryViz-compatible JSON"
    )
    .option("--width <value>", "width of generated SVG", "1300")
    .option("--height <value>", "height of generated SVG")
    .option(
        "--roughjs-config <key1=value1,key2=value2,...>",
        "various options to configure how the SVG is drawn" +
            " - refer to rough.js documentation for available options",
        parseRoughjsConfig
    );

program.parse();

const filePath = program.args[0];
const absolutePath = path.resolve(process.cwd(), filePath);

// Checks if absolutePath exists
let fileContent;
if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File ${absolutePath} does not exist.`);
    process.exit(1);
} else {
    fileContent = fs.readFileSync(absolutePath, "utf8");
}

let data;
try {
    data = JSON.parse(fileContent);
} catch (err) {
    console.error(`Error: Invalid JSON\n${err.message}.`);
    process.exit(1);
}

let m;
try {
    m = draw(data, true, {
        width: program.opts().width,
        height: program.opts().height,
        roughjs_config: { options: program.opts().roughjsConfig },
    });
} catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
}

const outputName = path.parse(filePath).name + ".svg";
try {
    m.save(outputName);
} catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
}
