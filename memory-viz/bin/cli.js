#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");
const { program } = require("commander");
const { json } = require("node:stream/consumers");

function parseFilePath(input) {
    const fullPath = path.resolve(process.cwd(), input);
    if (fs.existsSync(fullPath)) {
        return fullPath;
    }
    console.error(`Error: File ${fullPath} does not exist.`);
    process.exit(1);
}

function parseOutputPath(input) {
    if (fs.existsSync(input) && fs.statSync(input).isDirectory()) {
        console.error(`Error: Output path ${input} must be a file.`);
        process.exit(1);
    }
    const parsedPath = path.parse(input);
    const outputDir = parsedPath.dir || ".";
    if (!fs.existsSync(outputDir) || !fs.statSync(outputDir).isDirectory()) {
        console.error(
            `Error: Output directory ${outputDir} does not exist or is a file.`
        );
        process.exit(1);
    }
    return path.join(outputDir, parsedPath.base);
}

function parseRoughjsConfig(input) {
    const pairs = input.split(",");
    const keyValuePairs = pairs.map((pair) => pair.split("="));
    return Object.fromEntries(keyValuePairs);
}

function parseGlobalStyle(input) {
    const fullPath = path.resolve(process.cwd(), input);
    if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, "utf8");
    }
    console.error(`Error: CSS file ${fullPath} does not exist.`);
    process.exit(1);
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
    .option("--width <value>", "width of generated SVG")
    .option("--height <value>", "height of generated SVG")
    .option(
        "--roughjs-config <key1=value1,key2=value2,...>",
        "options to configure how the SVG is drawn" +
            " - refer to rough.js documentation for available options",
        parseRoughjsConfig
    )
    .option(
        "-s, --global-style <path>",
        "path to a CSS file containing global styles for the SVG",
        parseGlobalStyle
    )
    .option("-t, --theme <name>", "use themed styling for the generated SVG")
    .option("--not-interactive", "disable hover interactivity for object IDs");

program.parse();
const filePath = program.processedArgs[0];
const options = program.opts();

if (filePath) {
    const fileContent = fs.readFileSync(filePath, "utf8");

    let jsonContent;
    try {
        jsonContent = JSON.parse(fileContent);
    } catch (err) {
        console.error(`Error: Invalid JSON\n${err.message}.`);
        process.exit(1);
    }

    runMemoryViz(jsonContent);
} else {
    json(process.stdin)
        .then((jsonContent) => {
            runMemoryViz(jsonContent);
        })
        .catch((err) => {
            console.error(`Error: ${err.message}.`);
            process.exit(1);
        });
}

function runMemoryViz(jsonContent) {
    let m;
    try {
        m = draw(jsonContent, true, {
            width: options.width,
            height: options.height,
            roughjs_config: { options: options.roughjsConfig },
            global_style: options.globalStyle,
            theme: options.theme,
            interactive: !options.notInteractive,
        });
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }

    try {
        if (options.output) {
            m.save(options.output);
        } else {
            m.save();
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}
