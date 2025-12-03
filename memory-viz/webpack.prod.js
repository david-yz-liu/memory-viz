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
        mode: "production",
        devtool: "source-map",
    }),
    merge(browserEsmConfig, {
        mode: "production",
        devtool: "source-map",
    }),
    merge(cjsConfig, {
        mode: "production",
        devtool: "source-map",
    }),
    merge(esmConfig, {
        mode: "production",
        devtool: "source-map",
    }),
    merge(cliConfig, {
        mode: "production",
        devtool: "source-map",
    }),
];
