
const {MemoryModel, drawAutomated, getSize} = require("../dist/memory_models_rough.node.js");
const fs = require("fs");

/**
 * Draw the given objects on the canvas.
 * @param {string | object[]} objects - The list of objects (whether given as a collection objects, or in a JSON
 * file) that will be drawn on the canvas
 * @param {boolean} automation - Whether the coordinates (locations of the objects on the canvas) will be automatically
 * or manually drawn.
 * @param {null | number} automation_width - The width determined by the user, if automation is set to true (whether
 * automatic layout will be applied).
 * @param {Object} configuration - The configuration (display settings) defined by the user
 */
function draw(objects, automation, automation_width = null, configuration) {
    let objs;

    if (typeof objects === 'string') {
        // Use of fs.readFileSync(<path>, <options>) which synchronously reads and returns a string of the data stored
        // in the file that corresponds to path. It blocks execution of any other code until the file is read.
        const json_string = fs.readFileSync(objects, "utf-8");

        // Since fs.readFileSync returns a string, we then use JSON.parse in order to convert the return JSON string
        // into a valid JavaScript object (we assume that 'path' is the path to a valid JSON file).
        objs = JSON.parse(json_string);

    } else {
        objs = objects;
    }


    let m;

    if (automation) {
        if (automation_width === null){
            throw new Error("Width argument for automated drawing is required.")
        }

        m = drawAutomated(objs, automation_width, configuration)

    }

    else {

        if (!configuration.hasOwnProperty("width")) {

            let rightmost_obj;
            let rightmost_edge = 0;

            for (const obj of objs) {
                const width = getSize(obj).width;
                const curr_edge = obj.x + width;
                if ( curr_edge > rightmost_edge) {
                    rightmost_edge = curr_edge;
                    rightmost_obj = obj;
                }
            }
            configuration.width = rightmost_edge + 100;
        }

        if (!configuration.hasOwnProperty("height")) {

            let downmost_obj = objs[0];
            let downmost_edge = 0;

            for (const obj of objs) {

                const height = getSize(obj).height;
                const curr_edge = obj.y + height;

                if (curr_edge > downmost_edge){
                    downmost_obj = obj
                    downmost_edge = obj.y + height
                }
            }

            configuration.height = downmost_edge + 100;
        }

        m = new MemoryModel({width: configuration.width, height: configuration.height})
        m.drawAll(objs)
    }

    return m;

}

export {draw};

