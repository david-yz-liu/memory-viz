import { merge } from "webpack-merge";
import { libConfig, cliConfig } from "./webpack.common.js";

export default [
    merge(libConfig, {
        mode: "production",
        devtool: "source-map",
    }),
    merge(cliConfig, {
        mode: "production",
        devtool: "source-map",
    }),
];
