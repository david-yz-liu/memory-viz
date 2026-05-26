import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function generateSvgsPlugin() {
    return {
        name: "generate-svgs-plugin",

        async loadContent() {
            console.log("[generate-svgs-plugin] Generating SVGs...");
            execSync("pnpm run generate-svgs", {
                cwd: path.resolve(__dirname, "../"), // run command in docs/ directory
                stdio: "inherit", // print output of command to terminal
            });
            console.log("[generate-svgs-plugin] Done.");
        },
    };
}
