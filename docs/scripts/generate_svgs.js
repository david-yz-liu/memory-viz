#!/usr/bin/env node

// This script scans JSON files in docs/examples, to generate light and dark mode SVGs into static/images.
// The script only generates SVGs if the JSON file is newer than the SVG file.
// Usage: npm run generate-svgs.

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");

const jsonDirectory = path.resolve(__dirname, "../docs/examples");
const svgDirectory = path.resolve(__dirname, "../static/images");

/**
 * Determines whether svg should be redrawn based on timestamps.
 *
 * @param json - Path to the json file
 * @param svg - Path to the svg file
 * @returns {boolean} True if the target does not exist or is older than the source.
 */
function needsRebuild(json, svg) {
    if (!fs.existsSync(svg)) {
        return true;
    }
    const jsonTime = fs.statSync(json).mtime;
    const svgTime = fs.statSync(svg).mtime;
    return jsonTime > svgTime;
}

fs.readdirSync(jsonDirectory).forEach((directory) => {
    const jsonSubDirectory = path.join(jsonDirectory, directory);
    if (!fs.statSync(jsonSubDirectory).isDirectory()) {
        return;
    }

    const svgSubDirectory = path.join(svgDirectory, directory);
    fs.mkdirSync(svgSubDirectory, { recursive: true });

    fs.readdirSync(jsonSubDirectory).forEach((file) => {
        if (path.extname(file) !== ".json") {
            return;
        }
        const jsonPath = path.join(jsonSubDirectory, file);
        const baseName = path.basename(file, ".json");

        try {
            const svgPathLight = path.join(
                svgSubDirectory,
                `${baseName}_light.svg`
            );
            if (needsRebuild(jsonPath, svgPathLight)) {
                const svgLight = draw(jsonPath, true, {});
                svgLight.save(svgPathLight);
                console.log(`Created: ${svgPathLight}`);
            }

            const svgPathDark = path.join(
                svgSubDirectory,
                `${baseName}_dark.svg`
            );
            if (needsRebuild(jsonPath, svgPathDark)) {
                const svgDark = draw(jsonPath, true, { theme: "dark" });
                svgDark.save(svgPathDark);
                console.log(`Created: ${svgPathDark}`);
            }
        } catch (error) {
            console.error(`Error processing ${jsonPath}:`, error.message);
        }
    });
});
