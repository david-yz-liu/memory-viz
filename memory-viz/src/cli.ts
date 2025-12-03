#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { program } from "commander";
import { json } from "node:stream/consumers";
import type { DrawnEntity } from "./types";
import memoryViz from "./index";
import { MemoryModel } from "./memory_model";
import i18n from "./i18n-cli";

const { draw } = memoryViz;

function parseFilePath(input: string): string {
    const fullPath = path.resolve(process.cwd(), input);
    if (fs.existsSync(fullPath)) {
        return fullPath;
    }
    console.error(i18n.t("cli:errors.fileNotExist", { path: fullPath }));
    process.exit(1);
}

function parseOutputPath(input: string): string {
    if (fs.existsSync(input) && fs.statSync(input).isDirectory()) {
        console.error(i18n.t("cli:errors.outputMustBeFile", { path: input }));
        process.exit(1);
    }
    const parsedPath = path.parse(input);
    const outputDir = parsedPath.dir || ".";
    if (!fs.existsSync(outputDir) || !fs.statSync(outputDir).isDirectory()) {
        console.error(
            i18n.t("cli:errors.outputDirNotExist", { dir: outputDir })
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
    console.error(i18n.t("cli:errors.cssFileNotExist", { path: fullPath }));
    process.exit(1);
}

async function main() {
    await i18n.loadNamespaces("cli");

    program
        .description(i18n.t("cli:description"))
        .argument("[filePath]", i18n.t("cli:filePathArgument"), parseFilePath)
        .option("--output <path>", i18n.t("cli:outputOption"), parseOutputPath)
        .option("--width <value>", i18n.t("cli:widthOption"))
        .option("--height <value>", i18n.t("cli:heightOption"))
        .option(
            "--roughjs-config <key1=value1,key2=value2,...>",
            i18n.t("cli:roughjsConfigOption"),
            parseRoughjsConfig
        )
        .option(
            "-s, --global-style <path>",
            i18n.t("cli:globalStyleOption"),
            parseGlobalStyle
        )
        .option("-t, --theme <name>", i18n.t("cli:themeOption"))
        .option("--no-interactive", i18n.t("cli:noInteractiveOption"));

    program.parse();
    const filePath: string | undefined = program.processedArgs[0];
    const options = program.opts();

    if (filePath) {
        runMemoryViz(filePath, options);
    } else {
        json(process.stdin)
            .then((jsonContent) => {
                runMemoryViz(
                    jsonContent as DrawnEntity[] | DrawnEntity[][],
                    options
                );
            })
            .catch((err: any) => {
                console.error(
                    i18n.t("cli:errors.stdinError", { message: err.message })
                );
                process.exit(1);
            });
    }
}

main();

function runMemoryViz(
    jsonContent: string | DrawnEntity[] | DrawnEntity[][],
    options: any
): void {
    let m: MemoryModel | MemoryModel[];
    try {
        const config = {
            width: options.width,
            height: options.height,
            roughjs_config: { options: options.roughjsConfig },
            global_style: options.globalStyle,
            theme: options.theme,
            interactive: options.interactive,
        };

        if (typeof jsonContent === "string") {
            m = draw(jsonContent, true, config);
        } else if (
            Array.isArray(jsonContent) &&
            jsonContent.length > 0 &&
            Array.isArray(jsonContent[0])
        ) {
            m = draw(jsonContent as DrawnEntity[], true, config);
        } else {
            m = draw(jsonContent as DrawnEntity[][], true, config);
        }
    } catch (err: any) {
        if (err instanceof SyntaxError) {
            console.error(i18n.t("cli:errors.invalidJSON"));
        } else {
            console.error(
                i18n.t("cli:errors.generic", { message: err.message })
            );
        }
        process.exit(1);
    }

    try {
        if (Array.isArray(m)) {
            m.forEach((model) => {
                if (options.output) {
                    model.save(options.output);
                } else {
                    model.save();
                }
            });
        } else {
            if (options.output) {
                m.save(options.output);
            } else {
                m.save();
            }
        }
    } catch (err: any) {
        console.error(i18n.t("cli:errors.generic", { message: err.message }));
        process.exit(1);
    }
}
