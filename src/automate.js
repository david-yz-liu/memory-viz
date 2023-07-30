const {MemoryModel, config} = require("./memory_model.js");

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
    // Separating the objects given in the JSON file into two categories: stack frames, and everything else.
    const {stack_frames, other_items} = separateObjects(objects);


    // Call helper functions
    const {StackFrames, requiredHeight, requiredWidth} =
        drawAutomatedStackFrames(stack_frames, configuration);
    const {objs, canvas_height} = drawAutomatedOtherItems(other_items,
        width, null, configuration, requiredWidth);

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
 * @param {Object} configuration - The configuration set by the user.
 * @param {Object[]} stack_frames - The list of stack-frames that will be drawn
 * (without the specified x and y coordinates)
 *
 * @returns {Object} - Returns the objects consisting of three attributes as stack-frames which will be drawn,
 * the minimum required height on the canvas for drawing stack frames and required width for drawing all the stack
 * frames. Therefore, the last two attributes will be useful in terms of dynamically deciding the width and the height
 * of the canvas.
 */
function drawAutomatedStackFrames(stack_frames, configuration) {

    // Ensuring that not configuration options remain undefined.
    for (const req_prop of ["padding", "top_margin", "left_margin", "bottom_margin", "right_margin"]) {
        if (!configuration.hasOwnProperty(req_prop)) {
            configuration[req_prop] = config.obj_x_padding;
        }
    }

    // Determine the required minimum height to draw all the stack-frames (initialized as the top margin)
    let min_required_height = configuration.top_margin;

    // The width required for drawing stack-frames (corresponding to the maximum width among all the stack-frames)
    let required_width = 0;

    // The stack frames that will be drawn (the stack frames that are not blank
    let draw_stack_frames = [];


    // Loop through all the stack-frames to determine their individual box height
    for (const stack_frame of stack_frames){

        // Initialize the width and the height of the stack frames
        let width;
        let height;

        // get the width and height of each box
        if (stack_frame.name !== 'BLANK') {
            // Obtain the size of the given stack-frame
            const size = getSize(stack_frame)
            height = size.height;
            width = size.width

        } else {  // stack_frame.name === 'BLANK'
            // We already have access to the user defined dimensions of the box
            height = stack_frame.height;
            width = stack_frame.width;
        }

        if (width > required_width){
            required_width = width;

        }

        if (stack_frame.name !== 'BLANK'){
            // Mutate the stack_frame object
            stack_frame.x = configuration.left_margin;
            stack_frame.y = min_required_height;
            draw_stack_frames.push(stack_frame);
        }

        // Mutate the accumulators
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
 * @param {number} sf_endpoint - the x-coord of the right edge of the stackframe column; this will determine where the
 *                               object space begins.
 * @returns {object} the mutates list of objects (where each object is now equipped with x-y coordinates) and the
 * dynamically determined height the canvas will need to be.
 */
function drawAutomatedOtherItems(objs, max_width, sort_by, config_aut = {} /* to avoid undefined error */,
                                 sf_endpoint) {


    // Ensuring that not configuration options remain undefined.
    for (const req_prop of ["padding", "top_margin", "left_margin", "bottom_margin", "right_margin"]) {
        if (!config_aut.hasOwnProperty(req_prop)) {
            config_aut[req_prop] = config.obj_x_padding;
        }
    }

    // This will be used both as horizontal and as vertical padding for in-between the drawn boxes.
    const PADDING = config_aut.padding;

    // The object space begins where the stackframe column ends (plus padding), hence the use of the 'sf_endpoint'
    // parameter. If 'sf_endpoint' is undefined (i.e. was not passed at all), then by default we follow the 20-80
    // paradigm (the stack-frames and objects share the width of the canvas 20-80), however this is dangerous as
    // the stack-frames column might occupate more than 20 percent of the width of the canvas.
    if (sf_endpoint === undefined) {
        sf_endpoint = max_width * 0.2;
    }
    const START_X = sf_endpoint + PADDING;

    // Running getSize() for every object, and adding the returned width and height as additional properties to
    // that object, that is, equipping each object with its final dimensions.
    // NOTE: This assumes that, for a given object, the corresponding "draw" function will allocate the same space
    // (box size) every time, which is true from the implementations in the MemoryModel class.
    for (const item of objs) {
        if (item.name !== "BLANK") {
            const dimensions = getSize(item);
            item.height = dimensions.height;
            item.width = dimensions.width;

        } else {
            for (const attr of ["width", "height"]) {
                if (!item.hasOwnProperty(attr)) {
                    item[attr] = config.blank_default_dimensions[attr];
                }
            }
        }
    }

    /**
     * The 'sort' function optionally accepts a "compare" function used to determine the basis upon which to sort the array.
     * This "compare" function is created and assigned to the variable 'compareFunc' in the following switch statement.
     * @param a an object in objs
     * @param b another object in objs
     * @returns {number} negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
     */
    let compareFunc;

    // This switch statement is used to correctly define 'compareFunc', as per the user's sorting preferences
    // (represented by the 'sorted_by' parameter).
    // NOTE: If 'sort_by' is not assigned to one of "height" and "id", no sorting will take place.
    switch(sort_by) {
        case "height":
            compareFunc = compareByHeight;
            break;
        case "id":
            compareFunc = compareByID;
            break;
    }



    if (sort_by != null) {
        // Sorting 'objs' by descending height of the contained objects.
        objs.sort(compareFunc)
    }

    // Format of the top-left coordinates of the current (in this case, the first) object box: [x-coord, y-coord]
    let x_coord = START_X;
    let y_coord = config_aut.top_margin; // taking into account margin preferences


    // EXPLANATION: Once we fully occupy a row, we need to decide what the height of that row will be, as this will
    // determine the y-coordinate of the boxes in the NEXT row. To ensure that the height of the current row is
    // sufficient to accommodate for all boxes that have been drawn in this row, we consider the height of the tallest
    // object in this row (plus some padding).
    // We keep track of which objects have been drawn in the current row through the 'curr_row_objects' array,
    // which is reset every time we enter a new row. Once we are done with a row, we choose the tallest element object
    // from 'curr_row_objects' and make the height of that row be the height of this object (plus padding).
    // (Note that in this loop, nothing actually gets drawn, but rather each object gets equipped with coordinates).
    let row_height;
    // Using let instead of const because of the need to make the array empty every time we move to a new row.
    let curr_row_objects = [];

    // THE MAIN LOOP
    for (const item of objs) {
        // 'hor_reach' represents the x-coordinate that would be reached by the right edge (plus padding) of 'item'
        // if it were drawn on this row.
        // Alternatively, it is the x-coord of the left side of the next object.
        let hor_reach = x_coord + item.width + PADDING

        // In this case, we can fit this object in the current row.
        if (hor_reach < max_width) {
            // equipping this object with x and y coordinates
            item.x = x_coord;
            item.y = y_coord;

            curr_row_objects.push(item);

        } else {  // In this case, we canNOT fit this object in the current row, and must move to a new row

            // The 'row_height' variable is updated to hold the height of the tallest object in the current row
            // (the one we are about to leave), as this will determine the 'y_coord'.
            const tallest_object = curr_row_objects.reduce((p,c) => p.height >= c.height? p : c);
            row_height = tallest_object.height + PADDING;

            // Making 'curr_row_objects', as we now move to a new row.
            curr_row_objects = [];

            x_coord = START_X; // x_coord resets to where it was in the beggining
            y_coord = y_coord + row_height; // y_coord moves down by the height of the current row (the one we are leaving)


            // Equipping this object with x and y coordinates
            item.x = x_coord;
            item.y = y_coord;

            // Used to communicate that 'item' if the first object in a row
            item.rowBreaker = true;

            // Updating 'hor_reach', as 'x_coord' is now different.
            hor_reach = x_coord + item.width + PADDING

            // Updating 'curr_row_objects' array by pushing to it the rowBreaker
            curr_row_objects.push(item);
        }

        // Updating 'x_coord'. Intuitively, the left edge of the next object will be at the right edge of the current
        // object plus the padding.
        x_coord = hor_reach;

    }


    // ------------------------------------------------------
    // The 'row_height' accumulator is updated to hold the height of the new row (the one we are moving in now).
    // We sort 'curr_row_objects', so the first object is the tallest one, and we retrieve that object's height.

    // Finding the object with the rightmost edge and the object with the down-most edge. These objects will determine
    // the canvas_width and canvas_height that are returned by this function (to be the actual width and height of the
    // canvas).
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

    // The accumulator that stores the stack frames (and classes) that will be drawn.
    let stackFrames = [];
    // The accumulator that stores all the other items (objects) that will be drawn.
    let otherItems = [];

    for (const item of objects) {
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
    // a list with sizes, corresponding in parallel to the passed list of objects, in our case the returned list
    // contains only one size, hence we take the element at index 0.
    const size = m.drawAll([obj])[0];

    return {height: size.height, width: size.width};
}




// Helper Compare Functions

/**
 * Compares objects 'a' and 'b' by their height (assuming they both have the "height" property).
 * This function returns a negative integer if 'a' is taller (so, by definition of how sort uses the comparison
 * function, it will prioritize 'a' over 'b'), 0 if they are equally tall, and positive if 'b' is taller.
 * @param a an object
 * @param b another object
 * @returns {number} negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
 */
function compareByHeight(a, b) {
    return -(a.height - b.height) // or b.height - a.height
}

/**
 * Compares objects 'a' and 'b' by their id.
 * Returns a negative integer if 'a.id' is larger than 'b.id' (so, by definition of how sort uses the comparison
 * function, it will prioritize 'a' over 'b'), 0 if 'a' and 'b' have the same id's (WHICH SHOULD NOT HAPPEN),
 * and positive if 'b.id' is larger.
 * @param a an object
 * @param b another object
 * @returns {number} negative if 'a.id' is larger, 0 if a.id == b.id, and positive if 'b.id' is larger.
 */
function compareByID(a, b) {
    // return -(a.id - b.id) // or b.id - a.id // For Descending
    return a.id - b.id // For Ascending:
}


/**
 * Compares objects 'a' and 'b' by their "rightness". The metric for rightness is the x-coord of the object plus its width.
 * Returns a negative integer if 'a' is righter than 'b.id', 0 if 'a' and 'b' are equally right, and positive if
 * 'b' is righter.
 * @param a an object
 * @param b another object
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
 * @param a an object
 * @param b another object
 * @returns {number} negative if 'a' is bottomer, 0 if 'a' and 'b' are equally bottom, and positive if b' is bottomer.
 */
function compareByBottomness(a, b) {
    const a_bottom_edge = a.y + a.height;
    const b_bottom_edge = b.y + b.height;
    return -(a_bottom_edge - b_bottom_edge);
}

export { drawAutomated, drawAutomatedOtherItems, drawAutomatedStackFrames, separateObjects, getSize}