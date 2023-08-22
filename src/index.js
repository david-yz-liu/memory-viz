/**
The index file serves as the intermediate stage between all source files and the bundled file. Here we import
all the source js files, and by exporting them they get bundled to the bundle file. This is because we have
defined `entry: path.resolve(__dirname, "src/index.js")` in webpack.config.js.
 */

const { MemoryModel } = require("./memory_model.js");
const { config } = require("./config");
const {
    drawAutomated,
    drawAutomatedOtherItems,
    drawAutomatedStackFrames,
    getSize,
} = require("./automate.js");
const { draw } = require("./user_functions.js");

export default {
    MemoryModel,
    config,
    drawAutomated,
    drawAutomatedOtherItems,
    drawAutomatedStackFrames,
    draw,
    getSize,
};
