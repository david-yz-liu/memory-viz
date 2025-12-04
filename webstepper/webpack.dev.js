import { merge } from "webpack-merge";
import path from "path";
import { fileURLToPath } from "url";
import common from "./webpack.common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "dist"),
            },
            {
                directory: path.join(__dirname, "public"),
            },
        ],
        compress: true,
        port: 9000,
        client: {
            overlay: false,
        },
    },
});
