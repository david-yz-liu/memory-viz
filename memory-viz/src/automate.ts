import { MemoryModel } from "./memory_model";
import { config } from "./config";
import { DisplaySettings, DrawnEntity, Size, SortOptions } from "./types";

/**
 * Draws the objects given in the path in an automated fashion.
 *
 * @param objects - The list of objects that will be drawn on the canvas.
 * @param configuration - The configuration settings defined by the user.
 * @param width - User-defined width of the canvas.
 * @returns - The memory model that is created according to the objects given in the path (the JSON
 * file)
 */

const REQUIRED_DISPLAY_PROPERTIES: (keyof DisplaySettings)[] = [
    "padding",
    "top_margin",
    "left_margin",
    "bottom_margin",
    "right_margin",
];

const DEFAULT_PADDING = 25;

function drawAutomated(
    objects: DrawnEntity[],
    width: number | undefined,
    configuration: Partial<DisplaySettings>
): MemoryModel {
    const { stack_frames, other_items } = separateObjects(objects);

    // Assigning the objects with coordinates.
    const { StackFrames, requiredHeight, requiredWidth } =
        drawAutomatedStackFrames(stack_frames, configuration);

    // Determining the minimum width of the canvas.
    let min_width = 0;
    let item_width: number;
    for (const item of other_items) {
        item_width = getSize(item).width;
        if (item_width > min_width) {
            min_width = item_width;
        }
    }

    min_width +=
        requiredWidth + 2 * (configuration.padding ?? DEFAULT_PADDING) + 1;

    if (width !== undefined && width < min_width) {
        console.warn(
            `WARNING: provided width (${width}) is smaller than the required width` +
                ` (${min_width}). The provided width has been overwritten` +
                ` in the generated diagram.`
        );
        width = min_width;
    }

    // determining default width: should be 800 by default, but set to min_width if necessary
    let default_width = Math.min(min_width, 800);

    const { objs, canvas_height, canvas_width } = drawAutomatedOtherItems(
        other_items,
        width || default_width,
        configuration.sort_by ?? null,
        configuration,
        requiredWidth
    );

    const final_height = Math.max(canvas_height, requiredHeight) + 100;
    const m = new MemoryModel({
        width: width ? width : canvas_width,
        height: final_height,
        roughjs_config: configuration.roughjs_config,
        global_style: configuration.global_style,
    });

    m.drawAll(StackFrames);
    m.drawAll(objs);

    return m;
}

/**
 * Return the stack-frames with generated x and y coordinates, as well as the minimum required
 * height for drawing the stack-frames. The returned collection of stack-frames is the augmented version
 * of the input such that the x and y coordinates of the stack-frames are determined automatically.
 *
 * @param configuration - The configuration set by the user.
 * @param stack_frames - The list of stack-frames that will be drawn
 * (without the specified x and y coordinates)
 * @returns - Returns the object consisting of three attributes as follows: stack-frames which will be drawn,
 * the minimum required height of the canvas for drawing stack frames and required width for drawing all the stack
 * frames. Notably, the last two attributes will be useful in terms of dynamically deciding the width and the height
 * of the canvas.
 */
function drawAutomatedStackFrames(
    stack_frames: DrawnEntity[],
    configuration: Partial<DisplaySettings>
): {
    StackFrames: DrawnEntity[];
    requiredHeight: number;
    requiredWidth: number;
} {
    for (const req_prop of REQUIRED_DISPLAY_PROPERTIES) {
        if (!configuration.hasOwnProperty(req_prop)) {
            (configuration[req_prop] as number | undefined) =
                config.obj_x_padding;
        }
    }

    let min_required_height = configuration.top_margin ?? DEFAULT_PADDING;

    let required_width = 0;

    let draw_stack_frames: DrawnEntity[] = [];

    for (const stack_frame of stack_frames) {
        let width: number;
        let height: number;

        if (stack_frame.type !== ".blank-frame") {
            const size = getSize(stack_frame);
            height = size.height;
            width = size.width;
        } else {
            // We already have access to the user defined dimensions of the box.
            height = stack_frame.height!;
            width = stack_frame.width!;
        }

        if (width > required_width) {
            required_width = width;
        }

        if (stack_frame.type !== ".blank-frame") {
            stack_frame.x = configuration.left_margin;
            stack_frame.y = min_required_height;
            draw_stack_frames.push(stack_frame);
        }

        min_required_height = height + min_required_height;
    }
    if (configuration.left_margin !== undefined) {
        required_width += configuration.left_margin;
    }

    return {
        StackFrames: draw_stack_frames,
        requiredHeight: min_required_height,
        requiredWidth: required_width,
    };
}

/**
 * Automatic generation of coordinates for passed objects.
 *
 * Given a list of objects in the format described in MemoryModel.drawAll --but WITHOUT SPECIFIED COORDINATES-- and a
 * desired canvas width, this function mutates the passed list to equip each object with coordinates (corresponding to
 * the top-left corner of the object's box in the canvas).
 *
 * @param objs - list of objects in the format described in MemoryModel.drawAll
 * @param max_width - the desired width of the canvas
 * @param sort_by - the sorting criterion; must be "height" or "id", otherwise no sorting takes place.
 * @param config_aut - additional configuration options, such as margins, paddings, e.t.c.
 * @param sf_endpoint - the x-coordinate of the right edge of the stackframe column; this will determine
 *                              where the object space begins.
 * @returns the mutates list of objects (where each object is now equipped with x-y coordinates) and the
 * dynamically determined height the canvas will need to be.
 */
function drawAutomatedOtherItems(
    objs: DrawnEntity[],
    max_width: number,
    sort_by: SortOptions | null,
    config_aut: Partial<DisplaySettings>,
    sf_endpoint: number
): { objs: DrawnEntity[]; canvas_height: number; canvas_width: number } {
    for (const req_prop of REQUIRED_DISPLAY_PROPERTIES) {
        if (!config_aut.hasOwnProperty(req_prop)) {
            (config_aut[req_prop] as number | undefined) = config.obj_x_padding;
        }
    }

    const PADDING = config_aut.padding ?? DEFAULT_PADDING;

    // The object space begins where the stackframe column ends (plus padding).
    if (sf_endpoint === undefined) {
        sf_endpoint = max_width * 0.2;
    }
    const START_X = sf_endpoint + PADDING;

    for (const item of objs) {
        if (item.type === ".blank") {
            if (item.width === undefined || item.height === undefined) {
                console.warn(
                    "WARNING :: An object with type='.blank' or '.blank-frame' exists with missing dimension information " +
                        "(either the width or the height is missing). This object will be omitted in the memory model" +
                        " diagram."
                );
            }
            item.layoutHeight = item.height;
            item.layoutWidth = item.width;
        } else {
            const dimensions = getSize(item);
            item.layoutHeight = dimensions.height;
            item.layoutWidth = dimensions.width;
        }
    }

    /**
     * The 'sort' function optionally accepts a "compare" function used to determine the basis upon which to sort the array.
     * This "compare" function is created and assigned to the variable 'compareFunc' in the following switch statement.
     * @param a - an object in objs
     * @param b - another object in objs
     * @returns negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
     */
    let compareFunc: (a: DrawnEntity, b: DrawnEntity) => number;

    if (sort_by !== null) {
        switch (sort_by) {
            case SortOptions.Height:
                compareFunc = compareByHeight;
                break;
            case SortOptions.Id:
                compareFunc = compareByID;
                break;
        }
        objs.sort(compareFunc);
    }

    let x_coord = START_X;
    let y_coord = config_aut.top_margin ?? DEFAULT_PADDING;

    // Once a row is occupied, we must establish its height to determine the y-coordinate of the next row's boxes.
    let row_height: number;
    let curr_row_objects: DrawnEntity[] = [];
    for (const item of objs) {
        let hor_reach = x_coord + item.layoutWidth! + PADDING;

        if (hor_reach < max_width) {
            item.x = x_coord;
            item.y = y_coord;

            curr_row_objects.push(item);
        } else {
            // In this case, we cannot fit this object in the current row, and must move to a new row.
            // Based on how objs is initialized, every item will have attributes width and height
            const tallest_object = curr_row_objects.reduce((p, c) =>
                p.layoutHeight! >= c.layoutHeight! ? p : c
            );
            row_height = tallest_object.layoutHeight! + PADDING;

            curr_row_objects = [];

            x_coord = START_X;
            y_coord = y_coord + row_height;

            item.x = x_coord;
            item.y = y_coord;

            item.rowBreaker = true;

            hor_reach = x_coord + item.layoutWidth! + PADDING;

            curr_row_objects.push(item);
        }

        x_coord = hor_reach;
    }

    const defaultObject: DrawnEntity = {
        x: 0,
        y: 0,
        layoutHeight: 0,
        layoutWidth: 0,
    };
    const right_most_obj = objs.reduce(
        (prev, curr) => (compareByRightness(prev, curr) <= 0 ? prev : curr),
        defaultObject
    );
    const down_most_obj = objs.reduce(
        (prev, curr) => (compareByBottomness(prev, curr) <= 0 ? prev : curr),
        defaultObject
    );

    // compareByRightness and compareByBottomness didn't throw error, so right_most_obj and down_most_obj has attributes x, y, width, height
    const canvas_width =
        right_most_obj.x! +
        right_most_obj.layoutWidth! +
        (config_aut.right_margin ?? DEFAULT_PADDING);
    const canvas_height =
        down_most_obj.y! +
        down_most_obj.layoutHeight! +
        (config_aut.bottom_margin ?? DEFAULT_PADDING);

    // Additional -- to extend the program for the .blank option.
    const objs_filtered = objs.filter((item) => {
        return item.type !== ".blank";
    });
    objs = objs_filtered;

    return { objs, canvas_height, canvas_width };
}

/**
 * Separates the items that were given into two categories as stack frames and objects.
 * The returned object has two attributes as 'stack_frames' and 'other_items'.
 * Each of these attributes are a list of objects that were originally given by the user.
 *
 * @param objects - The list of objects, including stack-frames (if any) and other items, that
 * will be drawn
 * @returns an object separating between stack-frames and the rest of the items.
 */
function separateObjects(objects: DrawnEntity[]): {
    stack_frames: DrawnEntity[];
    other_items: DrawnEntity[];
} {
    let stackFrames: DrawnEntity[] = [];
    let otherItems: DrawnEntity[] = [];

    for (const item of objects) {
        const frame_types = [".frame", ".blank-frame"];

        if (item.type === undefined) {
            otherItems.push(item);
        } else if (
            item.type === ".blank" &&
            (item.width === undefined || item.height === undefined)
        ) {
            console.log(
                "WARNING :: An object with type='.blank' or '.blank-frame' exists with missing dimension information " +
                    "(either the width or the height is missing). This object will be omitted in the memory model" +
                    " diagram."
            );
        } else if (frame_types.includes(item.type)) {
            stackFrames.push(item);
        } else {
            otherItems.push(item);
        }
    }

    return { stack_frames: stackFrames, other_items: otherItems };
}

/**
 * Return the dimensions that the passed object will have if drawn on a canvas (in the context of the MemoryModel class).
 * This function can be used to determine how much space an object box will take on canvas (like a dry-run), given the
 * implementations of the 'draw' methods in MemoryModel.
 * @param obj - an object as specified in MemoryModel.drawAll, except that coordinates are missing.
 * @returns the width and the height the drawn object would have.
 */
function getSize(obj: DrawnEntity): Size {
    // The x and y values here are unimportant; 'obj' must simply have these properties for processing by 'drawAll'.
    obj.x = obj.x || 10;
    obj.y = obj.y || 10;

    const m = new MemoryModel();

    // As 'drawAll' provides a size list, where our case has just one element, we extract the element at index 0.
    const size = m.drawAll([obj])[0];

    return { height: size.height, width: size.width };
}

/**
 * Compares objects 'a' and 'b' by their height (assuming they both have the "height" property).
 * This function returns a negative integer if 'a' is taller (so, by definition of how sort uses the comparison
 * function, it will prioritize 'a' over 'b'), 0 if they are equally tall, and positive if 'b' is taller.
 * @param a - an object
 * @param b - another object
 * @returns negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
 */
function compareByHeight(a: DrawnEntity, b: DrawnEntity): number {
    if (a.layoutHeight === undefined || b.layoutHeight === undefined) {
        throw new Error("Both objects must have 'layoutHeight' property.");
    }
    return -(a.layoutHeight - b.layoutHeight);
}

/**
 * Compares objects 'a' and 'b' by their id.
 * Returns a negative integer if 'a.id' is larger than 'b.id' (so, by definition of how sort uses the comparison
 * function, it will prioritize 'a' over 'b'), 0 if 'a' and 'b' have the same id's (WHICH SHOULD NOT HAPPEN),
 * and positive if 'b.id' is larger.
 * @param a - an object
 * @param b - another object
 * @returns negative if 'a.id' is larger, 0 if a.id == b.id, and positive if 'b.id' is larger.
 */
function compareByID(a: DrawnEntity, b: DrawnEntity): number {
    if (
        a.id === undefined ||
        b.id === undefined ||
        a.id === null ||
        b.id === null
    ) {
        throw new Error("Both objects must have 'id' property.");
    }
    return a.id - b.id;
}

/**
 * Compares objects 'a' and 'b' by their "rightness". The metric for rightness is the x-coord of the object plus its width.
 * Returns a negative integer if 'a' is righter than 'b.id', 0 if 'a' and 'b' are equally right, and positive if
 * 'b' is righter.
 * @param a - an object
 * @param b - another object
 * @returns negative if 'a' is righter, 0 if 'a' and 'b' are equally right, and positive if b' is righter.
 */
function compareByRightness(a: DrawnEntity, b: DrawnEntity): number {
    if (
        a.x === undefined ||
        a.layoutWidth === undefined ||
        b.x === undefined ||
        b.layoutWidth === undefined
    ) {
        throw new Error(
            "Both objects must have 'x' and 'layoutWidth' property."
        );
    }
    const a_right_edge = a.x + a.layoutWidth;
    const b_right_edge = b.x + b.layoutWidth;
    return -(a_right_edge - b_right_edge);
}

/**
 * Compares objects 'a' and 'b' by their "bottomness". The metric for rightness is the y-coord of the object plus its height.
 * Returns a negative integer if 'a' is bottomer than 'b.id', 0 if 'a' and 'b' are equally bottom, and positive if
 * 'b' is bottomer.
 * @param a - an object
 * @param b - another object
 * @returns negative if 'a' is bottomer, 0 if 'a' and 'b' are equally bottom, and positive if b' is bottomer.
 */
function compareByBottomness(a: DrawnEntity, b: DrawnEntity): number {
    if (
        a.y === undefined ||
        a.layoutHeight === undefined ||
        b.y === undefined ||
        b.layoutHeight === undefined
    ) {
        throw new Error(
            "Both objects must have 'y' and 'layoutHeight' property."
        );
    }
    const a_bottom_edge = a.y + a.layoutHeight;
    const b_bottom_edge = b.y + b.layoutHeight;
    return -(a_bottom_edge - b_bottom_edge);
}

export {
    drawAutomated,
    drawAutomatedOtherItems,
    drawAutomatedStackFrames,
    separateObjects,
    getSize,
};
