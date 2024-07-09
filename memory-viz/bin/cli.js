#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");
const { program } = require("commander");

function parseFilePath(input) {
    return pathExists(input, `File`);
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

function parseStdin() {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            input += chunk;
        }
    });
    process.stdin.on("end", () => {
        return input;
    });
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
    .option(
        "--filepath <filepath>",
        "path to a file containing MemoryViz-compatible JSON",
        parseFilePath
    )
    .option("--stdin", "takes input from standard input")
    .option("--stdout", "directs generated SVG to standard output")
    .option(
        "--output <path>",
        "directs generated SVG to specified path",
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
const options = program.opts();

let jsonContent;
if (options.filepath) {
    jsonContent = fs.readFileSync(options.filepath, "utf8");
} else if (options.stdin) {
    jsonContent = options.stdin;
    console.log(jsonContent);
    process.exit(0);
    if (!options.stdout && !options.output) {
        console.error(
            `Error: Either --stdout or --output <path> must be provided if --stdin is passed.`
        );
        process.exit(1);
    }
} else {
    console.error(`Error: Either --stdin or --filepath must be provided.`);
    process.exit(1);
}

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

let outputName;
if (options.filepath) {
    outputName = path.parse(options.filepath).name + ".svg";
} else {
    outputName = "memory_viz.svg";
}

try {
    if (options.stdout) {
        if (options.output) {
            console.warn(
                "Since both --stdout and --output were provided, the output was redirected to stdout."
            );
        }
        m.save();
    } else if (options.output) {
        const newOutputName = path.join(options.output, outputName);
        m.save(newOutputName);
    } else {
        m.save(outputName);
    }
} catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
}

// const { program } = require("commander");

// let stdin = "";

// program.option("--stdin", "Take input from standard input").parse(process.argv);

// const options = program.opts();

// // Handling stdin if --stdin option is provided
// if (options.stdin) {
//     process.stdin.setEncoding("utf8"); // Set encoding for stdin on Windows
//     process.stdin.on('data', function() {
//         var chunk = this.read();
//         if (chunk !== null) {
//            stdin += chunk;
//            console.log(typeof(chunk))
//         }
//     });
//     process.stdin.on("end", () => {
//         console.log(stdin.trim()); // Output accumulated stdin data
//     });

//     process.stdin.on("close", () => {
//         // This event is more reliable for terminal input handling
//         console.log("Terminal input stream closed, processing...");
//          // Process accumulated stdin data
//     });
// } else {
//     // If --stdin option is not provided, use the remaining arguments as the message
//     const message = program.args.join(" ");
//     console.log(message); // Output the message
// }
