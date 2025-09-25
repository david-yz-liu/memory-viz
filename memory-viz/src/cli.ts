#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { program } from "commander";
import { json } from "node:stream/consumers";
import type { DrawnEntity } from "./types";
import memoryViz from "./index";

const { draw } = memoryViz;

function parseFilePath(input: string): string {
    const fullPath = path.resolve(process.cwd(), input);
    if (fs.existsSync(fullPath)) {
        return fullPath;
    }
    console.error(`Error: File ${fullPath} does not exist.`);
    process.exit(1);
}

function parseOutputPath(input: string): string {
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

function parseRoughjsConfig(input: string): Record<string, string> {
    const pairs = input.split(",");
    const keyValuePairs = pairs.map((pair) => pair.split("="));
    return Object.fromEntries(keyValuePairs);
}

function parseGlobalStyle(input: string): string {
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
    .option("--no-interactive", "disable hover interactivity for object IDs");

program.parse();
const filePath: string | undefined = program.processedArgs[0];
const options = program.opts();

if (filePath) {
    runMemoryViz(filePath);
} else {
    json(process.stdin)
        .then((jsonContent) => {
            runMemoryViz(jsonContent as DrawnEntity[] | DrawnEntity[][]);
        })
        .catch((err: any) => {
            console.error(`Error: ${err.message}.`);
            process.exit(1);
        });
}

function runMemoryViz(
    jsonContent: string | DrawnEntity[] | DrawnEntity[][]
): void {
    let m: any;
    try {
        m = draw(jsonContent as any, true, {
            width: options.width,
            height: options.height,
            roughjs_config: { options: options.roughjsConfig },
            global_style: options.globalStyle,
            theme: options.theme,
            interactive: options.interactive,
        });
    } catch (err: any) {
        if (err.message && err.message.includes("not valid JSON")) {
            console.error(`Error: Invalid JSON`);
        } else {
            console.error(`Error: ${err.message}`);
        }
        process.exit(1);
    }

    try {
        if (options.output) {
            m.save(options.output);
        } else {
            m.save();
        }
    } catch (err: any) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}
