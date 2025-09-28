const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = [
    merge(common.libConfig, {
        mode: "production",
        devtool: "source-map",
    }),
    merge(common.cliConfig, {
        mode: "production",
        devtool: "source-map",
    }),
];
