import { MemoryModel } from "./memory_model.js";
import { config } from "./config.js";
import {
    drawAutomated,
    drawAutomatedOtherItems,
    drawAutomatedStackFrames,
    getSize,
} from "./automate.js";
import { draw } from "./user_functions.js";

export default {
    MemoryModel,
    config,
    drawAutomated,
    drawAutomatedOtherItems,
    drawAutomatedStackFrames,
    draw,
    getSize,
};
