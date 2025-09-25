const path = require("path");

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
    },
    module: libConfig.module,
    externalsPresets: { node: true },
    resolve: libConfig.resolve,
};

module.exports = [libConfig, cliConfig];
