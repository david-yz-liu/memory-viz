import { merge } from "webpack-merge";
import TerserPlugin from "terser-webpack-plugin";
import {
    browserConfig,
    browserEsmConfig,
    cjsConfig,
    esmConfig,
    cliConfig,
} from "./webpack.common.js";

// Disabling Terser's mangle/compress steps keeps the source code intact
// Necessary for the cli tests to pass, since they rely on the source code being preserved in the snapshots
const preserveInteractivitySource = {
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: false,
                    mangle: false,
                },
            }),
        ],
    },
};

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
        ...preserveInteractivitySource,
    }),
];
