// A library allowing interaction with the file system (e.g. creating new files
// const { MemoryModel } = require("./index.js")
//  import {MemoryModel} from "./index.js"
// const { MemoryModel } = require("../dist/memory_models_rough.node")
const {MemoryModel, config} = require("./index.js");

function drawAutomated(path, width) {
    // Separating the objects given in the JSON file into two categories: stack frames, and everything else.
    const {stack_frames, other_items} = separateJSON(path);

    // Two separate canvas
    const stackframes_canvas_width = width / 5
    const otheritems_canvas_width = width - (width / 5)

    // Call our helper functions
    drawAutomatedStackFrames(stack_frames, stackframes_canvas_width)
    drawAutomatedOtherItems(other_items, otheritems_canvas_width)
}

function drawAutomatedOtherItems(objs, other_items_width) {
    console.log("config: " + config.obj_x_padding);
    // This will be used both as horizontal and as vertical padding for in-between the drawn boxes.
    const PADDING = config.obj_x_padding;

    // Since the stack-frames and objects ("other_items") share the width of the canvas 20-80, the objects will start
    // at 0.2 times the width of the canvas, plus some padding to be safe.
    const START_X = other_items_width * 0.2 + PADDING;


    // Running getSize() for every object, and adding the returned width and height as additional properties to
    // that object, that is, equiping each object with its final dimensions.
    // NOTE: This assumes that, for a given object, the corresponding "draw" function will allocated the same space
    // (box size) every time, which is true from the implementations in the MemoryModel class.
    for (const item of objs) {
        const dimensions = getSize(item);
        item.height = dimensions.height;
        item.width = dimensions.width;
    }

    /**
     * The 'sort' function optionally accepts a function used to determine the basis upon which to sort the array.
     * We want to sort the objects in 'objs' by height, so this function returns a negative integer if 'a' is taller
     * (so, by definition of how sort uses the comparison function, it will prioritize 'a' over 'b'), 0 if they are
     * equally tall, and positive if 'b' is taller.
     * @param a an object in objs
     * @param b another object in objs
     * @returns {number} negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
     */
    function compareByHeight(a, b) {
        return -(a.height - b.height) // or b.height - a.height
    }

    objs.sort(compareByHeight)

    // -------------------------------------------------------------------------------------------------------------

    // Format of the top-left coordinates of the current (in this case, the first) object box: [x-coord, y-coord]
    let x_coord = START_X;
    let y_coord = PADDING;

    // Thinking: Every time we need to move to a new row, we choose the height of that new row to be the height of the
    // tallest object in the array that has not yet been "drawn" (in this loop, nothing actually gets drawn, but rather
    // each object gets equipped with coordinates), plus the usual padding. The tallest object amongst the remaining ones
    // in actually the first remaining object in the array --due to the sorting that has taken place above-- hence we
    // take 'objs[0].height'.
    let row_height = objs[0].height + PADDING;

    // Initializing an accumulator that will eventually determine the height of the canvas. Thus will dynamically
    // increase the canvas' height, as the need appears to move to a new "row".
    let canvas_height = row_height;

    
    for (const item of objs) {
        let hor_bound = x_coord + item.width + PADDING
        if (hor_bound < other_items_width) {
            item.x = x_coord;
            item.y = y_coord;
            x_coord = hor_bound;
        }
        else {
            x_coord = START_X;
            y_coord = y_coord + row_height;
            row_height = item.height + PADDING;

            item.x = x_coord;
            item.y = y_coord;

            x_coord = x_coord + item.width + PADDING;

            ///////
            canvas_height += row_height;
        }

    }
    
    return {objs, canvas_height};
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

// console.log("&*&*&*&*&*&*&*&**&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&")
// console.log(MemoryModel);
// console.log(__dirname);
// console.log("&*&*&*&*&*&*&*&**&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&")

/**
 * Return the dimensions that the passed object will have if drawn on a canvas (in the context of the MemoryModel class).
 * This function can be used to determine how much space an object box will take on canvas (like a dry-run), given the
 * implementations of the 'draw' methods in MemoryModel.
@param {object} obj - an object as specified in MemoryModel.drawAll, except that it is unnecessary to provide coordinates.
 @returns {object} the width and the height the drawn object would have.
 */
function getSize(obj) {

    // The value of the x and y properties here is irrelevant; we just need to equip 'obj' with x and y properties so
    // it can be processed by the MemoryModel.drawAll function (which required the passed objects to be in a certain format).
    obj.x = 10;
    obj.y = 10;

    // Initializing a MemoryModel object
    const m = new MemoryModel()

    //////// console.log("************ " + m + " **********")

    // By definition, MemoryModel.drawAll accepts a list of objects. However, this functions accepts a single object.
    // So to use 'MemoryModel.drawAll', we pass a list with a single object. Since 'MemoryModel.drawAll' returns
    // a list with sizes, corresponding in parallel to the passedl list of objects, in our case the returned list
    // contains only one size, hence we take the element at index 0.
    const size = m.drawAll([obj])[0];

    return {height: size.height, width: size.width};
}
export default { drawAutomated, drawAutomatedOtherItems, drawAutomatedStackFrames, separateJSON, getSize}