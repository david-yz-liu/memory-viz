import path from "path";
import { fileURLToPath } from "url";
import nodeExternals from "webpack-node-externals";
import webpack from "webpack";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shared = {
    entry: path.resolve(__dirname, "src/index.ts"),
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

// Browser UMD build
export const browserConfig = {
    ...shared,
    name: "browser",
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "memory-viz.umd.js",
        library: {
            name: "memoryViz",
            type: "umd",
            export: "default",
        },
        globalObject: "this",
        clean: false, // Prevent deletion of type declaration files under dist/
    },
    resolve: {
        ...shared.resolve,
        fallback: {
            fs: false, // Ensures fs will not be bundled or polyfilled
        },
    },
};

// ESM browser build
export const browserEsmConfig = {
    ...shared,
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "memory-viz.browser.js",
        libraryTarget: "module",
        clean: false,
    },
    experiments: {
        outputModule: true, // Required for ESM output
    },
    resolve: {
        ...shared.resolve,
        fallback: {
            fs: false, // Ensures fs will not be bundled or polyfilled
        },
    },
};

// CJS Node build
export const cjsConfig = {
    ...shared,
    name: "cjs",
    target: "node",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "memory-viz.node.cjs",
        library: {
            type: "commonjs2", // CommonJS bundle for Node
            export: "default",
        },
        clean: false,
    },
};

// ESM Node build
export const esmConfig = {
    ...shared,
    name: "esm",
    target: "node",
    experiments: {
        outputModule: true, // Required for ESM output
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "memory-viz.node.js",
        library: {
            type: "module", // ESM bundle
        },
        clean: false,
    },
};

export const cliConfig = {
    target: "node",
    entry: "./src/cli.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "cli.js",
        clean: false,
    },
    experiments: {
        outputModule: true,
    },
    module: shared.module,
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    resolve: shared.resolve,
    plugins: [
        new webpack.BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true,
            entryOnly: true,
        }),
    ],
};
