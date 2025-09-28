const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = [
    merge(common.libConfig, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
    }),
    merge(common.cliConfig, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
    }),
];
