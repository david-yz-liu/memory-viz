

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
    for (const i in stack_frames){

        let stack_frame = stack_frames[i];
        // Get object's width
        let box_width = config.obj_min_width;
        let longest = 0;
        for (const attribute in stack_frame.value) {
            longest = Math.max(longest, attribute.length * 12)
        }
        if (longest > 0) {
            box_width = longest + config.item_min_width * 3
        }
        // Adjust for the class name
        box_width = Math.max(
            box_width,
            config.prop_min_width + (stack_frame.name.length * 12) + 10
        )
        if (box_width > stack_frames_width){
            throw "Increase the width of the canvas.";
        } else {
            // Get object's height
            let box_height = 0
            if (Object.keys(stack_frame.value).length > 0){
                box_height =
                    ((config.item_min_width * 3) / 2) *
                    Object.keys(stack_frame.value).length +
                    config.item_min_width / 2 +
                    config.prop_min_height
            } else {
                box_height = config.obj_min_height

                // Mutate the stack_frame object
                stack_frame.x = Math.round((stack_frames_width - box_width) / 2);
                stack_frame.y = prev_required_height + 10;

                // Mutate the accumulators
                min_required_height += box_height;
                prev_required_height = box_height;
            }
        }


    }
    return {StackFrames: stack_frames, requiredHeight: min_required_height}
}

// Default configurations we are using
const config = {
    rect_style: {stroke: "rgb(0, 0, 0)"},
    text_color: "rgb(0, 0, 0)", // Default text color
    value_color: "rgb(27, 14, 139)", // Text color for primitive values
    id_color: "rgb(150, 100, 28)", // Text color for object ids
    item_min_width: 50, // Minimum width of an item box in a collection
    item_min_height: 50, // Minimum height of an item box in a collection
    obj_min_width: 200, // Minimum width of object rectangle
    obj_min_height: 130, // Minimum height of object rectangle
    prop_min_width: 60, // Minimum width of type and id boxes
    prop_min_height: 50, // Minimum height of type and id boxes
    obj_x_padding: 25, // Minimum horizontal padding of object rectangle
    double_rect_sep: 6, // Separation between double boxes around immutable objects
    list_index_sep: 20, // Vertical offset for list index labels
    font_size: 20, // Font size, in px
    browser: false, // Whether this library is being used in a browser context
}