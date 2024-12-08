const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.([jt]sx?)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-typescript",
                            "@babel/preset-react",
                        ],
                    },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            { test: /\.json$/, type: "json" },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    externals: {
        fs: "fs",
    },
    externalsType: "window",
    plugins: [
        new HtmlWebpackPlugin({
            title: "MemoryViz Webstepper",
            filename: "./index.html",
            template: "./src/html/index.html",
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"],
        alias: {
            "memory-viz": path.resolve(__dirname, "../memory-viz"),
        },
    },
};
