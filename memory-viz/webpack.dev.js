import { merge } from "webpack-merge";
import { libConfig, cliConfig } from "./webpack.common.js";

export default [
    merge(libConfig, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
    }),
    merge(cliConfig, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
    }),
];
