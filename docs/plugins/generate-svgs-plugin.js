import generateSvgs from "./generate_svgs.js";

export default function generateSvgsPlugin() {
    return {
        name: "generate-svgs-plugin",

        async loadContent() {
            console.log(
                "[generate-svgs-plugin] Generating MemoryViz Diagrams..."
            );
            generateSvgs();
            console.log("[generate-svgs-plugin] Done.");
        },
    };
}
