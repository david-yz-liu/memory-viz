#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");
const { program } = require("commander");

program
    .description(
        "Command line interface for generating memory model diagrams with MemoryViz"
    )
    .argument(
        "<filepath>",
        "path to a file containing MemoryViz-compatible JSON"
    )
    .option("--width <value>", "width of generated SVG", "1300")
    .option("--height <value>", "height of generated SVG");

program.parse();

const filePath = program.args[0];
const absolutePath = path.resolve(process.cwd(), filePath);

// Checks if absolutePath exists and that it is a JSON file
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
    // TODO: Replace seed with command-line arguments
    if (program.opts().height === undefined) {
        m = draw(data, true, {
            width: program.opts().width,
            roughjs_config: { options: { seed: 12345 } },
        });
    } else {
        m = draw(data, true, {
            width: program.opts().width,
            height: program.opts().height,
            roughjs_config: { options: { seed: 12345 } },
        });
    }
} catch (err) {
    console.error(
        `This is valid JSON but not valid Memory Models JSON.` +
            `Please refer to the repo for more details.`
    );
    process.exit(1);
}

const outputName = path.parse(filePath).name + ".svg";
try {
    m.save(outputName);
} catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
}
