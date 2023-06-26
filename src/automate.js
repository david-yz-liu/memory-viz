const {MemoryModel, config} = require("./index.js");
const fs = require("fs");

/**
 * Draws the objects given in the path in an automated fashion.
 * 
 * @param {string} path - The path to the JSON file that includes the objects that will be drawn
 * @param {number} width - User-defined width of the canvas
 * @returns {MemoryModel} - The memory model that is created according to the objects given in the path (the JSON
 * file)
 */
function drawAutomated(path, width) {
    // Separating the objects given in the JSON file into two categories: stack frames, and everything else.
    const {stack_frames, other_items} = separateJSON(path);

    const stack_frames_canvas_width = width / 5

    // Call helper functions
    const {StackFrames, requiredHeight} = drawAutomatedStackFrames(stack_frames, stack_frames_canvas_width);
    const {objs, canvas_height} = drawAutomatedOtherItems(other_items, width);

    // The required height for the canvas
    const final_height = Math.max(canvas_height, requiredHeight) + 100;

    // initializing a MemoryModel object
    const m = new MemoryModel({width: width, height: final_height});

    m.drawAll(StackFrames);
    m.drawAll(objs);

    return m;
}

/**
 * Return the stack-frames with the specified x and y coordinates, as well as the minimum required
 * height for drawing the stack-frames. The returned collection of stack-frames is the augmented version
 * of the input such that the x and y coordinates of the stack-frames are determined automatically.
 *
 * @param {Object[]} stack_frames - The list of stack-frames that will be drawn
 * (without the specified x and y coordinates)
 * @param {number} stack_frames_width - The pre-decided canvas width.
 *
 */
function drawAutomatedStackFrames(stack_frames, stack_frames_width) {

    // Determine the required min height to draw all the stack-frames
    let min_required_height = 0;

    // The height of the previous drawn stack-frame (0 if there are no previous drawings)
    let prev_required_height = 10;

    // Loop through all the stack-frames to determine their individual box height
    for (const stack_frame of stack_frames){

        // get the width and height of each box
        const {height, width} = getSize(stack_frame)

        // Mutate the stack_frame object
        stack_frame.x = Math.round((stack_frames_width - width) / 2);
        stack_frame.y = prev_required_height;

        // Mutate the accumulators
        min_required_height = (height + min_required_height);
        prev_required_height = (min_required_height + 10);

    }

    return {StackFrames: stack_frames, requiredHeight: min_required_height};
    }


/**
 * Automatic generation of coordinates for passed objects.
 *
 * Given a list of objects in the format described in MemoryModel.drawAll --but WITHOUT SPECIFIED COORDINATES-- and a
 * desired canvas width, this function mutates the passed list to equip each object with coordinates (corresponding to
 * the top-left corner of the object's box in the canvas).
 *
 * @param {[object]} objs list of objects in the format described in MemoryModel.drawAll
 * @param {number} canvas_width the desired width of the canvas
 *
 * @returns {object} the mutates list of objects (where each object is now equipped with x-y coordinates) and the
 * dynamically determined height the canvas will need to be.
 */
function drawAutomatedOtherItems(objs, canvas_width) {
    console.log("config: " + config.obj_x_padding);
    // This will be used both as horizontal and as vertical padding for in-between the drawn boxes.
    const PADDING = config.obj_x_padding;

    // Since the stack-frames and objects ("other_items") share the width of the canvas 20-80, the objects will start
    // at 0.2 times the width of the canvas, plus some padding to be safe.
    const START_X = canvas_width * 0.2 + PADDING;


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

    // Sorting 'objs' by descending height of the contained objects.
    objs.sort(compareByHeight)

    // -------------------------------------------------------------------------------------------------------------

    // Format of the top-left coordinates of the current (in this case, the first) object box: [x-coord, y-coord]
    let x_coord = START_X;
    let y_coord = PADDING;

    // EXPLANATION: Every time we need to move to a new row, we choose the height of that new row to be the height of the
    // tallest object in the array that has not yet been "drawn" (in this loop, nothing actually gets drawn, but rather
    // each object gets equipped with coordinates), plus the usual padding. The tallest object amongst the remaining ones
    // in actually the first remaining object in the array --due to the sorting that has taken place above-- hence we
    // take 'objs[0].height'.
    let row_height = objs[0].height + PADDING;

    // Initializing an accumulator that will eventually determine the height of the canvas. Thus will dynamically
    // increase the canvas' height, as the need appears to move to a new "row".
    let canvas_height = row_height;

    // THE MAIN LOOP
    for (const item of objs) {
        // 'hor_reach' represents the x-coordinate that would be reached by the right edge (plus padding) of 'item'
        // if it were drawn on this row.
        // Alternatively, it is the location of the top-left corner of the next object if it this object (and the next)
        // were to be drawn.
        let hor_reach = x_coord + item.width + PADDING

        // In this case, we can fit this object in the current row.
        if (hor_reach < canvas_width) {
            // equipping this object with x and y coordinates
            item.x = x_coord;
            item.y = y_coord;
        }
        // In this case, we canNOT fit this object in the current row, and must move to a new row
        else {
            x_coord = START_X; // x_coord resets to where it was in the beggining
            y_coord = y_coord + row_height; // y_coord moves down by the height of the current row (the one we are leaving)

            // The 'row_height' accumulator is updated to hold the height of the new row (the one we are moving in now).
            // Due to the sorting above, this 'item' is tallest amongst all remaining ones, hence the choice.
            row_height = item.height + PADDING;
            canvas_height += row_height; // Updating 'canvas_height' to include the height of the new row

            // Equipping this object with x and y coordinates
            item.x = x_coord;
            item.y = y_coord;

            item.rowBreaker = true;

            // Updating 'hor_reach', as 'x_coord' is now different.
            hor_reach = x_coord + item.width + PADDING
        }

        // Updating 'x_coord'. Intuitively, the left edge of the next object will be at the right edge of the current
        // object plus the padding.
        x_coord = hor_reach;

    }

    canvas_height += 50; // safety precaution

    return {objs, canvas_height};
}


/**
 * Separates the items that were given in the JSON file into two categories as stack frames
 * and objects. The returned object has two attributes as 'stack_frames' and 'other_items'.
 * Each of these attributes are a list of objects that were originally given in the JSON file.
 *
 * @param {string} path - the path to the JSON file.
 * @returns {object} an object separating between stackframes and the rest of the items.
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
        if (item.stack_frame) {  // Whether a stack frame will be drawn.
            stackFrames.push(item);
        } else {
            otherItems.push(item);
        }
    }

    return {stack_frames: stackFrames, other_items: otherItems};
}


/**
 * Return the dimensions that the passed object will have if drawn on a canvas (in the context of the MemoryModel class).
 * This function can be used to determine how much space an object box will take on canvas (like a dry-run), given the
 * implementations of the 'draw' methods in MemoryModel.
 * @param {object} obj - an object as specified in MemoryModel.drawAll, except that coordinates are missing.
 * @returns {object} the width and the height the drawn object would have.
 */
function getSize(obj) {
    // The value of the x and y properties here is irrelevant; we just need to equip 'obj' with x and y properties so
    // it can be processed by the MemoryModel.drawAll function (which required the passed objects to be in a certain format).
    obj.x = 10;
    obj.y = 10;

    // Initializing a MemoryModel object
    const m = new MemoryModel();

    // By definition, MemoryModel.drawAll accepts a list of objects. However, this functions accepts a single object.
    // So to use 'MemoryModel.drawAll', we pass a list with a single object. Since 'MemoryModel.drawAll' returns
    // a list with sizes, corresponding in parallel to the passedl list of objects, in our case the returned list
    // contains only one size, hence we take the element at index 0.
    const size = m.drawAll([obj])[0];

    return {height: size.height, width: size.width};
}

/**
 * Makes the memory model more visually appealing by a "vertical centering" of the objects' boxes.
 *
 * The idea is that the first object in a row (the "rowBreaker") could be much taller than the remaining ones in that
 * row, so instead of putting all y-coordinates of the top-left corner to be the same across all these objects,
 * the non-rowBreaker boxes are brought down a bit so that they look vertically centered. Specifically, they are
 * brought down until the margin from the top of the rowBreaker and the margin from the bottom of the rowBreaker
 * are equal.
 *
 * NOTE: Once again, there is no canvas here or actual visual displacements, but merely mutation of the passed list
 * of objects, changing the "y" property of some objects. Of course, this does translate to visual changes once
 * you put this list of objects on canvas (e.g. using the 'MemoryModel.drawAll' method).
 *
 * @param {[object]} objs the list of objects which we want to vertically beautify
 * @returns {[object]} a mutates list of objects, with altered y-coordinates for the objects.
 */
export function vert_beautify(objs) {
    // Initially, the height against which we compare is the height of the first object, the tallest of all.
    let height = objs[0].height

    for (const obj of objs) {
        // Ensuring every object has the 'rowBreaker' property. All "first" objects in row have them from the
        // 'drawAutomatedOtherItems' functions, but the rest do not.
        obj.rowBreaker = obj.rowBreaker|false;

        // we are changing row so we now need to compare against the first object of that row.
        // All displacement happen relative to the "rowBreaker" object, so this object does not move at all.
        if (obj.rowBreaker) {
            height = obj.height;
        }
        else {
            // Calculations (to make margins from the top and the bottom of the "rowBreaker" box equal)
            const diff = height - obj.height;
            const displacement = diff/2;
            obj.y = obj.y + displacement
        }
    }

    return objs;
}

function horiz_beautif(objs) {

}

export default { vert_beautify, drawAutomated, drawAutomatedOtherItems, drawAutomatedStackFrames, separateJSON, getSize}