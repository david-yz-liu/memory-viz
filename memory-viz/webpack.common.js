import path from "path";
import { fileURLToPath } from "url";
import nodeExternals from "webpack-node-externals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libConfig = {
    // target: "web",
    entry: path.resolve(__dirname, "src/index.ts"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "memory-viz.bundle.js",
        library: {
            name: "memoryViz",
            type: "umd",
            export: "default",
        },
        globalObject: "this",
        clean: false, // Prevent deletion of type declaration files under dist/
    },
    module: {
        rules: [
            {
                test: /\.([jt]s)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
        ],
    },
    externals: {
        fs: "fs",
    },
    resolve: {
        extensions: [".ts", ".js"],
        extensionAlias: {
            ".js": [".ts", ".js"],
        },
        alias: {
            roughjs: "roughjs/bundled/rough.esm.js",
        },
    },
};

const cliConfig = {
    target: "node",
    entry: "./src/cli.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "cli.js",
        clean: false,
        library: {
            type: "module",
        },
    },
    experiments: {
        outputModule: true,
    },
    module: libConfig.module,
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    resolve: libConfig.resolve,
};

export { libConfig, cliConfig };
