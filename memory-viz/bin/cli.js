#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");

// Check for correct number of arguments
if (process.argv.length !== 3) {
    console.error(
        "Error: wrong number of arguments.\nUsage: memory-viz <path-to-file>"
    );
    process.exit(1);
}
const filePath = process.argv[2];
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
    console.error(`Error: Invalid JSON.`);
    process.exit(1);
}

let m;
try {
    // TODO: Replace width and seed with command-line arguments
    m = draw(data, true, { width: 1300, seed: 12345 });
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
