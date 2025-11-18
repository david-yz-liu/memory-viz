import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
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
            title: "MemoryViz Demo",
            filename: "./index.html",
            template: "./src/html/index.html",
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"],
        extensionAlias: {
            ".js": [".ts", ".tsx", ".js", ".jsx"],
        },
        alias: {
            "memory-viz": path.resolve(__dirname, "../memory-viz"),
        },
    },
};
