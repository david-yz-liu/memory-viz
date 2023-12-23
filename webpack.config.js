const path = require("path");

module.exports = [
    {
        // target: "web",
        entry: path.resolve(__dirname, "src/index.ts"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "memory_models_rough.js",
            library: {
                name: "MemoryModelsRough",
                type: "umd",
                export: "default",
            },
            globalObject: "this",
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
        mode: "development",
        devtool: "inline-source-map",
        externals: {
            fs: "fs",
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
    },
];
