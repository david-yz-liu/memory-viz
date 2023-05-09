const path = require("path")

const module_config = {
    rules: [
        {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
        },
    ],
}

module.exports = [
    {
        target: "web",
        entry: path.resolve(__dirname, "src/index.js"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "memory_models_rough.js",
            library: {
                name: "MemoryModelsRough",
                type: "umd",
                export: "default",
            },
        },
        module: module_config,
        mode: "development",
        devtool: 'inline-source-map',
        resolve: {
            fallback: {
                fs: false,
            },
        },
    },
    {
        target: "node",
        entry: path.resolve(__dirname, "src/index.js"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "memory_models_rough.node.js",
            library: {
                name: "MemoryModelsRough",
                type: "umd",
                export: "default",
            },
        },
        module: module_config,
        mode: "development",
        devtool: 'inline-source-map',
    },
]
