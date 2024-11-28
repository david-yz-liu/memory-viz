import { MemoryModel } from "./memory_model";
import { drawAutomated, getSize } from "./automate";
import { DrawnEntity, DisplaySettings } from "./types";
import type * as fsType from "fs";
export * from "./types";

// Dynamic import of Node fs module
let fs: typeof fsType | undefined;
if (typeof window === "undefined") {
    fs = require("fs");
}

function draw(
    objects: string | DrawnEntity[][],
    automation: boolean,
    configuration: Partial<DisplaySettings>
): MemoryModel[];
function draw(
    objects: string | DrawnEntity[],
    automation: boolean,
    configuration: Partial<DisplaySettings>
): MemoryModel;
/**
 * Draw the given objects on the canvas.
 *
 * The format of the array of objects must adhere to the description provided in MemoryModel.drawAll.
 *
 * @param objects - The array of objects to be drawn: this could be passed as an actual JavaScript
 * array of objects (a single snapshot), or as a JSON file containing the object array. This array of objects may also include the
 * user-defined style configuration. It can also be a list of snapshots, where each snapshot is an array of objects.
 * See the demo files and style.md file for details.
 * @param automation - Whether the coordinates (of the objects on the canvas) should be automatically
 * generated or manually inputted.
 * @param configuration - The configuration (display settings) defined by the user.
 *                          This is also the place to define `sort_by` ("height" or "id") for the object space.
 *                          NOTE: In the case that automation == true, then the user must define configuration.width,
 *                          as this will be used as the "max canvas width" for the automation process.
 *                          If automation == false, then all configuration properties are optional, and the function
 *                          will still operate even without defining them.
 *
 * @returns the produced canvas, either a single canvas or a list of canvas, depending on the objects input.
 */
function draw(
    objects: string | DrawnEntity[] | DrawnEntity[][],
    automation: boolean,
    configuration: Partial<DisplaySettings>
): MemoryModel | MemoryModel[] {
    let objs: DrawnEntity[] | DrawnEntity[][];

    if (typeof objects === "string") {
        const json_string = fs.readFileSync(objects, "utf-8");

        // Convert the JSON string into an array consisting of valid JS objects.
        objs = JSON.parse(json_string);
    } else {
        objs = objects;
    }

    const isArrayOfArrays = Array.isArray(objs) && Array.isArray(objs[0]);

    const processSnapshot = (snapshotObjects: DrawnEntity[]) => {
        getCanvasDimensions(configuration, snapshotObjects);
        const model = new MemoryModel({
            width: configuration.width,
            height: configuration.height,
            roughjs_config: configuration.roughjs_config,
        });
        model.drawAll(snapshotObjects);
        return model;
    };

    if (isArrayOfArrays) {
        const snapshots = objs as DrawnEntity[][];
        return automation
            ? snapshots.map((snapshotObjects) =>
                  drawAutomated(
                      snapshotObjects,
                      configuration.width,
                      configuration
                  )
              )
            : snapshots.map(processSnapshot);
    }

    const snapshotObjects = objs as DrawnEntity[];
    return automation
        ? drawAutomated(snapshotObjects, configuration.width, configuration)
        : processSnapshot(snapshotObjects);
}

function getCanvasDimensions(
    configuration: Partial<DisplaySettings>,
    snapshotObjects: DrawnEntity[]
): void {
    // Dynamically determining the width of the canvas, in case one has not been provided.
    if (!configuration.hasOwnProperty("width")) {
        let rightmost_obj;
        let rightmost_edge = 0;

        for (const obj of snapshotObjects) {
            const width = getSize(obj).width;
            const curr_edge = obj.x + width;
            if (curr_edge > rightmost_edge) {
                rightmost_edge = curr_edge;
                rightmost_obj = obj;
            }
        }
        configuration.width = rightmost_edge + 100;
    }

    // Dynamically determining the height of the canvas, in case one has not been provided.
    if (!configuration.hasOwnProperty("height")) {
        let downmost_obj = snapshotObjects[0];
        let downmost_edge = 0;

        for (const obj of snapshotObjects) {
            const height = getSize(obj).height;
            const curr_edge = obj.y + height;

            if (curr_edge > downmost_edge) {
                downmost_obj = obj;
                downmost_edge = obj.y + height;
            }
        }

        configuration.height = downmost_edge + 100;
    }
}

export { draw };
