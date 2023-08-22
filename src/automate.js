const {MemoryModel} = require("./memory_model.js");
const {config} = require("./config")

/**
 * Draws the objects given in the path in an automated fashion.
 * 
 * @param {object[]} objects - The list of objects that will be drawn on the canvas.
 * @param {Object} configuration - The configuration settings defined by the user.
 * @param {number} width - User-defined width of the canvas.
 * @returns {MemoryModel} - The memory model that is created according to the objects given in the path (the JSON
 * file)
 */
function drawAutomated(objects, width, configuration) {
    const {stack_frames, other_items} = separateObjects(objects);

    // These functions assign the objects with coordinates.
    const {StackFrames, requiredHeight, requiredWidth} =
        drawAutomatedStackFrames(stack_frames, configuration);
    const {objs, canvas_height} = drawAutomatedOtherItems(other_items,
        width, configuration.sort_by, configuration, requiredWidth);

    const final_height = Math.max(canvas_height, requiredHeight) + 100;

    const m = new MemoryModel({width: width, height: final_height});

    m.drawAll(StackFrames);
    m.drawAll(objs);

    return m;
}

/**
 * Return the stack-frames with generated x and y coordinates, as well as the minimum required
 * height for drawing the stack-frames. The returned collection of stack-frames is the augmented version
 * of the input such that the x and y coordinates of the stack-frames are determined automatically.
 *
 * @param {Object} configuration - The configuration set by the user.
 * @param {Object[]} stack_frames - The list of stack-frames that will be drawn
 * (without the specified x and y coordinates)
 * @returns {Object} - Returns the object consisting of three attributes as follows: stack-frames which will be drawn,
 * the minimum required height of the canvas for drawing stack frames and required width for drawing all the stack
 * frames. Notably, the last two attributes will be useful in terms of dynamically deciding the width and the height
 * of the canvas.
 */
function drawAutomatedStackFrames(stack_frames, configuration) {

    for (const req_prop of ["padding", "top_margin", "left_margin", "bottom_margin", "right_margin"]) {
        if (!configuration.hasOwnProperty(req_prop)) {
            configuration[req_prop] = config.obj_x_padding;
        }
    }

    let min_required_height = configuration.top_margin;

    let required_width = 0;

    let draw_stack_frames = [];

    // Loop through all the stack-frames to determine their individual box height.
    for (const stack_frame of stack_frames){

        let width;
        let height;

        if (stack_frame.name !== 'BLANK') {
            const size = getSize(stack_frame)
            height = size.height;
            width = size.width;

        } else {
            // We already have access to the user defined dimensions of the box.
            height = stack_frame.height;
            width = stack_frame.width;
        }

        if (width > required_width){
            required_width = width;
        }

        if (stack_frame.name !== 'BLANK'){
            stack_frame.x = configuration.left_margin;
            stack_frame.y = min_required_height;
            draw_stack_frames.push(stack_frame);
        }

        min_required_height = (height + min_required_height);

    }

    required_width += configuration.padding;

    return {StackFrames: draw_stack_frames, requiredHeight: min_required_height, requiredWidth: required_width};
    }


/**
 * Automatic generation of coordinates for passed objects.
 *
 * Given a list of objects in the format described in MemoryModel.drawAll --but WITHOUT SPECIFIED COORDINATES-- and a
 * desired canvas width, this function mutates the passed list to equip each object with coordinates (corresponding to
 * the top-left corner of the object's box in the canvas).
 *
 * @param {[object]} objs - list of objects in the format described in MemoryModel.drawAll
 * @param {number} max_width - the desired width of the canvas
 * @param {*} sort_by - the sorting criterion; must be "height" or "id", otherwise no sorting takes place.
 * @param {object} config_aut - additional configuration options, such as margins, paddings, e.t.c.
 * @param {number} sf_endpoint - the x-coordinate of the right edge of the stackframe column; this will determine
 *                              where the object space begins.
 * @returns {object} the mutates list of objects (where each object is now equipped with x-y coordinates) and the
 * dynamically determined height the canvas will need to be.
 */
function drawAutomatedOtherItems(objs, max_width, sort_by, config_aut = {} /* to avoid undefined error */,
                                 sf_endpoint) {

    for (const req_prop of ["padding", "top_margin", "left_margin", "bottom_margin", "right_margin"]) {
        if (!config_aut.hasOwnProperty(req_prop)) {
            config_aut[req_prop] = config.obj_x_padding;
        }
    }

    const PADDING = config_aut.padding;

    // The object space begins where the stackframe column ends (plus padding).
    if (sf_endpoint === undefined) {
        sf_endpoint = max_width * 0.2;
    }
    const START_X = sf_endpoint + PADDING;

    for (const item of objs) {
        if (item.name !== "BLANK") {
            const dimensions = getSize(item);
            item.height = dimensions.height;
            item.width = dimensions.width;

        }
    }

    /**
     * The 'sort' function optionally accepts a "compare" function used to determine the basis upon which to sort the array.
     * This "compare" function is created and assigned to the variable 'compareFunc' in the following switch statement.
     * @param a - an object in objs
     * @param b - another object in objs
     * @returns {number} negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
     */
    let compareFunc;

    switch(sort_by) {
        case "height":
            compareFunc = compareByHeight;
            break;
        case "id":
            compareFunc = compareByID;
            break;
    }



    if (sort_by !== null) {
        objs.sort(compareFunc)
    }

    let x_coord = START_X;
    let y_coord = config_aut.top_margin;


    // Once a row is occupied, we must establish its height to determine the y-coordinate of the next row's boxes.
    let row_height;
    let curr_row_objects = [];
    // Note that in this loop, nothing actually gets drawn, but rather each object gets equipped with coordinates.
    for (const item of objs) {
        let hor_reach = x_coord + item.width + PADDING

        if (hor_reach < max_width) {
            item.x = x_coord;
            item.y = y_coord;

            curr_row_objects.push(item);

        } else {  // In this case, we cannot fit this object in the current row, and must move to a new row

            const tallest_object = curr_row_objects.reduce((p,c) => p.height >= c.height? p : c);
            row_height = tallest_object.height + PADDING;

            curr_row_objects = [];

            x_coord = START_X;
            y_coord = y_coord + row_height;

            item.x = x_coord;
            item.y = y_coord;

            // Used to communicate that 'item' if the first object in a row
            item.rowBreaker = true;

            hor_reach = x_coord + item.width + PADDING

            curr_row_objects.push(item);
        }

        x_coord = hor_reach;

    }



    const right_most_obj = objs.reduce((prev, curr) => compareByRightness(prev, curr) <= 0 ? prev : curr);
    const down_most_obj = objs.reduce((prev, curr) => compareByBottomness(prev, curr) <= 0 ? prev : curr);

    const canvas_width = right_most_obj.x + right_most_obj.width + config_aut.right_margin;
    const canvas_height = down_most_obj.y + down_most_obj.height + config_aut.bottom_margin;

    // Additional -- to extend the program for the BLANK option
    const objs_filtered = objs.filter((item) => {return item.name !== "BLANK"});
    objs = objs_filtered;


    return {objs, canvas_height, canvas_width};
}


/**
 * Separates the items that were given into two categories as stack frames and objects.
 * The returned object has two attributes as 'stack_frames' and 'other_items'.
 * Each of these attributes are a list of objects that were originally given by the user.
 *
 * @param {object[]} objects - The list of objects, including stack-frames (if any) and other items, that
 * will be drawn
 * @returns {object} an object separating between stack-frames and the rest of the items.
 */
function separateObjects(objects) {

    let stackFrames = [];
    let otherItems = [];

    for (const item of objects) {
        if (item.name === "BLANK" && (item.width === undefined || item.height === undefined)) {
            console.log("WARNING :: An object with name='BLANK' exists with missing dimension information " +
                "(either the width or the height is missing). This object will be omitted in the memory model" +
                " diagram.")
        }

        else if (item.stack_frame) {
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
    // The x and y values here are unimportant; 'obj' must simply have these properties for processing by 'drawAll'.
    obj.x = obj.x || 10;
    obj.y = obj.y || 10;

    const m = new MemoryModel();

    // As 'drawAll' provides a size list, where our case has just one element, we extract the element at index 0.
    const size = m.drawAll([obj])[0];

    return {height: size.height, width: size.width};
}





/**
 * Compares objects 'a' and 'b' by their height (assuming they both have the "height" property).
 * This function returns a negative integer if 'a' is taller (so, by definition of how sort uses the comparison
 * function, it will prioritize 'a' over 'b'), 0 if they are equally tall, and positive if 'b' is taller.
 * @param a - an object
 * @param b - another object
 * @returns {number} negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
 */
function compareByHeight(a, b) {
    return -(a.height - b.height)
}

/**
 * Compares objects 'a' and 'b' by their id.
 * Returns a negative integer if 'a.id' is larger than 'b.id' (so, by definition of how sort uses the comparison
 * function, it will prioritize 'a' over 'b'), 0 if 'a' and 'b' have the same id's (WHICH SHOULD NOT HAPPEN),
 * and positive if 'b.id' is larger.
 * @param a - an object
 * @param b - another object
 * @returns {number} negative if 'a.id' is larger, 0 if a.id == b.id, and positive if 'b.id' is larger.
 */
function compareByID(a, b) {
    return a.id - b.id
}


/**
 * Compares objects 'a' and 'b' by their "rightness". The metric for rightness is the x-coord of the object plus its width.
 * Returns a negative integer if 'a' is righter than 'b.id', 0 if 'a' and 'b' are equally right, and positive if
 * 'b' is righter.
 * @param a - an object
 * @param b - another object
 * @returns {number} negative if 'a' is righter, 0 if 'a' and 'b' are equally right, and positive if b' is righter.
 */
function compareByRightness(a, b) {
    const a_right_edge = a.x + a.width;
    const b_right_edge = b.x + b.width;
    return -(a_right_edge - b_right_edge);
}

/**
 * Compares objects 'a' and 'b' by their "bottomness". The metric for rightness is the y-coord of the object plus its height.
 * Returns a negative integer if 'a' is bottomer than 'b.id', 0 if 'a' and 'b' are equally bottom, and positive if
 * 'b' is bottomer.
 * @param a - an object
 * @param b - another object
 * @returns {number} negative if 'a' is bottomer, 0 if 'a' and 'b' are equally bottom, and positive if b' is bottomer.
 */
function compareByBottomness(a, b) {
    const a_bottom_edge = a.y + a.height;
    const b_bottom_edge = b.y + b.height;
    return -(a_bottom_edge - b_bottom_edge);
}

export { drawAutomated, drawAutomatedOtherItems, drawAutomatedStackFrames, separateObjects, getSize}