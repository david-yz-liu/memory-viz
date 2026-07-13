import fs from "fs";
import { MemoryModel } from "./memory_model.js";
import {
    type DrawnEntity,
    DrawnEntitySchema,
    type DisplaySettings,
} from "./types.js";
import { prettifyError } from "zod";
export * from "./types.js";

function draw(
    objects: string | object[][],
    configuration: Partial<DisplaySettings>
): MemoryModel[];
function draw(
    objects: string | object[],
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
 * @param configuration - The configuration (display settings) defined by the user.
 *                          This is also the place to define `sort_by` ("height" or "id") for the object space.
 *
 * @returns the produced canvas, either a single canvas or a list of canvas, depending on the objects input.
 */
function draw(
    objects: string | object[] | object[][],
    configuration: Partial<DisplaySettings>
): MemoryModel | MemoryModel[] {
    let objs: object[] | object[][];

    if (typeof objects === "string") {
        if (!fs) {
            throw new Error(
                `Could not load file ${objects} in this environment.`
            );
        }
        const json_string = fs.readFileSync(objects, "utf-8");

        // Convert the JSON string into an array consisting of valid JS objects.
        objs = JSON.parse(json_string);
    } else {
        objs = objects;
    }

    const isArrayOfArrays = Array.isArray(objs) && Array.isArray(objs[0]);

    const parseObjects = (objects: object[]): DrawnEntity[] => {
        const parsed_objects: DrawnEntity[] = [];
        for (const raw_obj of objects) {
            const result = DrawnEntitySchema.safeParse(raw_obj);
            if (!result.success) {
                const pretty = prettifyError(result.error);
                throw new Error(pretty);
            }

            const obj = result.data;
            parsed_objects.push(obj);
        }

        return parsed_objects;
    };

    const processSnapshot = (snapshotObjects: object[]) => {
        const model = new MemoryModel({
            width: configuration.width,
            height: configuration.height,
            roughjs_config: configuration.roughjs_config,
            global_style: configuration.global_style,
            theme: configuration.theme,
            interactive: configuration.interactive,
            sort_by: configuration.sort_by,
            padding: configuration.padding,
            top_margin: configuration.top_margin,
            left_margin: configuration.left_margin,
            bottom_margin: configuration.bottom_margin,
            right_margin: configuration.right_margin,
        });
        model.drawAll(parseObjects(snapshotObjects));
        return model;
    };

    if (isArrayOfArrays) {
        const snapshots = objs as object[][];
        return snapshots.map(processSnapshot);
    }

    const snapshotObjects = objs as object[];
    return processSnapshot(snapshotObjects);
}

export { draw };
