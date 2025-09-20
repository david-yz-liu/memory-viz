const path = require("path");

module.exports = {
    target: "node",
    entry: "./src/cli.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "cli.js",
        clean: false, // Prevent deletion of type declaration files under dist/
    },
    module: require("./webpack.common.js").module,
    externalsType: "commonjs",
    externals: {
        fs: "fs",
        path: "path",
        commander: "commander",
    },
    resolve: require("./webpack.common.js").resolve,
};
