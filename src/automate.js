// A library allowing interaction with the file system (e.g. creating new files
// const { MemoryModel } = require("./index.js")
//  import {MemoryModel} from "./index.js"
// const { MemoryModel } = require("../dist/memory_models_rough.node")
import MemoryModel from "index.js"

function drawAutomated(path, width) {
    // Separating the objects given in the JSON file into two categories: stack frames, and everything else.
    const {stack_frames, other_items} = seperateJSON(path);

    // Two separate canvas
    const stackframes_canvas_width = width / 5
    const otheritems_canvas_width = width - (width / 5)

    // Call our helper functions
    drawAutomatedStackFrames(stack_frames, stackframes_canvas_width)
    drawAutomatedOtherItems(other_items, otheritems_canvas_width)
}

function drawAutomatedOtherItems(other_items, other_items_width) {

}


function drawAutomatedStackFrames(other_items, other_items_width) {

}

/**
 * Separates the items that were given in the JSON file into two categories as stack frames
 * and objects. The returned object has two attributes as 'stack_frames' and 'other_items'.
 * Each of these attributes are a list of objects that were originally given in the JSON file.
 *
 * @param {string} path - the path to the JSON file.
 */
function separateJSON(path) {

    // Use of fs.readFileSync(<path>, <options>) which synchronously reads and returns a string of the data stored
    // in the file that corresponds to path. It blocks execution of any other code until the file is read.
    const json_string = fs.readFileSync(path, "utf-8");

    // Since fs.readFileSync returns a string, we then use JSON.parse in order to convert the return JSON string
    // into a valid JavaScript object (we assume that 'path' is the path to a valid JSON file).
    const listOfObjs = JSON.parse(json_string);

    // The accumulator that stores the stack frames (and classes) that will be drawn.
    let stackFrames = [];
    // The accumulator that stores all the other items (objects) that will be drawn.
    let otherItems = [];

    for (const item of listOfObjs) {
        if (item.isClass) {  // Whether a stack frame will be drawn.
            stackFrames.push(item);
        } else {
            otherItems.push(item);
        }
    }

    return {stack_frames: stackFrames, other_items: otherItems};

}

console.log("&*&*&*&*&*&*&*&**&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&")
console.log(MemoryModel);
console.log(__dirname);
console.log("&*&*&*&*&*&*&*&**&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&")

function getSize(obj) {
    obj.x = 10;
    obj.y = 10;
    const m = new MemoryModel()
    console.log("************ " + m + " **********")
    const size = m.drawAll(obj)[0];
    return size;
}
export default { drawAutomated, drawAutomatedOtherItems, drawAutomatedStackFrames, separateJSON, getSize}