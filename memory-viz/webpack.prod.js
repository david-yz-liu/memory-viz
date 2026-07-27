import { merge } from "webpack-merge";
import TerserPlugin from "terser-webpack-plugin";
import {
    browserConfig,
    browserEsmConfig,
    cjsConfig,
    esmConfig,
    cliConfig,
} from "./webpack.common.js";

// memory_model.ts embeds several of its own functions into generated SVGs by
// reading their live source via .toString() (see setInteractivityScript()).
// Standard minification renames variables and rewrites control flow, which
// would corrupt that embedded source. cli.spec.tsx runs against this built
// CLI bundle directly (unlike other tests, which run against unminified TS
// source), so it's the only target where this has been observed to break.
// Disabling Terser's mangle/compress steps keeps that source intact; only
// whitespace is stripped, which the .toString() technique doesn't depend on.
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
