import { merge } from "webpack-merge";
import {
    browserConfig,
    browserEsmConfig,
    cjsConfig,
    esmConfig,
    cliConfig,
} from "./webpack.common.js";

export default [
    merge(browserConfig, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
    }),
    merge(browserEsmConfig, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
    }),
    merge(cjsConfig, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
    }),
    merge(esmConfig, {
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
