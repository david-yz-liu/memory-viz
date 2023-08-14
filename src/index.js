const {MemoryModel} = require("./memory_model.js");
const {config} = require("./config");
const {drawAutomated, drawAutomatedOtherItems, drawAutomatedStackFrames, getSize} = require("./automate.js");
const {draw} = require("./user_functions.js");

export default {MemoryModel, config, drawAutomated, drawAutomatedOtherItems, drawAutomatedStackFrames, draw, getSize};
