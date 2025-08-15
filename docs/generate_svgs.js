const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");

const jsonDirectory = path.resolve(__dirname, "docs/examples");
const svgDirectory = path.resolve(__dirname, "static/images");

fs.readdirSync(jsonDirectory).forEach((directory) => {
    const jsonSubDirectory = path.join(jsonDirectory, directory);

    if (fs.statSync(jsonSubDirectory).isDirectory()) {
        const svgSubDirectory = path.join(svgDirectory, directory);
        fs.mkdirSync(svgSubDirectory, { recursive: true });

        fs.readdirSync(jsonSubDirectory).forEach((file) => {
            if (path.extname(file) === ".json") {
                const jsonPath = path.join(jsonSubDirectory, file);
                const baseName = path.basename(file, ".json");

                try {
                    const svgPathLight = path.join(
                        svgSubDirectory,
                        `${baseName}_light.svg`
                    );
                    if (!fs.existsSync(svgPathLight)) {
                        const svgLight = draw(jsonPath, true, {});
                        svgLight.save(svgPathLight);
                        console.log(`Created: ${svgPathLight}`);
                    }

                    const svgPathDark = path.join(
                        svgSubDirectory,
                        `${baseName}_dark.svg`
                    );
                    if (!fs.existsSync(svgPathDark)) {
                        const svgDark = draw(jsonPath, true, { theme: "dark" });
                        svgDark.save(svgPathDark);
                        console.log(`Created: ${svgPathDark}`);
                    }
                } catch (error) {
                    console.error(
                        `Error processing ${jsonPath}:`,
                        error.message
                    );
                }
            }
        });
    }
});
