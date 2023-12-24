const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = [
    {
        entry: path.resolve(__dirname, "src/index.tsx"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "index.js",
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
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        mode: "development",
        devtool: "inline-source-map",
        externals: {
            fs: "fs",
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Memory Models Rough Demo",
                filename: "./index.html",
                template: "./src/html/index.html",
            }),
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
        },
    },
];
