import rough from "roughjs";

import merge from "deepmerge";

import { collections, immutable, presets, setStyleSheet } from "./style";
import { config } from "./config";
import { DOMImplementation, XMLSerializer } from "@xmldom/xmldom";
import {
    DrawnEntity,
    DrawnEntitySchema,
    DrawnEntityStrict,
    DrawnEntityWithDimensions,
    Primitive,
    Rect,
    SortOptions,
    Style,
    VisualizationConfig,
} from "./types";
import { isArrayOfNullableType, isStyle } from "./typeguards";
import { RoughSVG } from "roughjs/bin/svg";
import { Config, Options } from "roughjs/bin/core";
import type * as fsType from "fs";
import type * as CSS from "csstype";
import { prettifyError } from "zod";

// Dynamic import of Node fs module
let fs: typeof fsType | undefined;
if (typeof window === "undefined") {
    fs = require("fs");
}

/** The class representing the memory model diagram of the given block of code. */
export class MemoryModel {
    /**
     * Create the memory model diagram.
     * @property svg - An svg 'Element' object from the DOM (Document Object Model) module.
     *                          Scalable Vector Graphics (svg) is an image format based on geometry.
     * @property rough_svg - Instantiating a RoughSVG object by passing the root svg node (this.svg) to the
     *                                'rough.svg()' method. As per the documentation of the 'rough' library,
     *                                "RoughSVG provides the main interface to work with this library".
     *
     * NOTE: Other properties of this class are a consequence of the constant 'config' object in the bottom of this file.
     *       These include 'id_colour', 'obj_min_width', and 'font_size'. The 'config' constant also contains default
     *       values for these properties.
     *       Moreover, width and height can be optionally set for the canvas by passing them as attributes
     *       to the 'options' argument.
     *
     */
    document: Document;
    svg: SVGSVGElement;
    rough_svg: RoughSVG;
    rect_style: Options = { stroke: "rgb(0, 0, 0)" };
    text_color: string = "rgb(0, 0, 0)"; // Default text color
    value_color: string = "rgb(27, 14, 139)"; // Text color for primitive values
    id_color: string = "rgb(150, 100, 28)"; // Text color for object ids
    item_min_width: number = 50; // Minimum width of an item box in a collection
    item_min_height: number = 50; // Minimum height of an item box in a collection
    obj_min_width: number = 200; // Minimum width of object rectangle
    obj_min_height: number = 130; // Minimum height of object rectangle
    prop_min_width: number = 60; // Minimum width of type and id boxes
    prop_min_height: number = 50; // Minimum height of type and id boxes
    obj_x_padding: number = 25; // Minimum horizontal padding of object rectangle
    canvas_padding: number = 25; // Minimum padding of the canvas
    canvas_padding_bottom: number = 25; // Minimum padding of the bottom of the canvas
    double_rect_sep: number = 6; // Separation between double boxes around immutable objects
    list_index_sep: number = 20; // Vertical offset for list index labels
    font_size: number = 20; // Font size, in px
    browser: boolean = false; // Whether this library is being used in a browser context
    roughjs_config: Config; // Configuration object used to pass in options to rough.js
    width?: number; // Width of the canvas, dynamically updated if not provided in options
    height?: number; // Height of the canvas, dynamically updated if not provided in options
    objectCounter: number; // Counter for tracking ids of objects drawn
    interactive: boolean = true; // Whether the visualization is interactive
    sort_by?: SortOptions;
    top_margin: number = 25;
    left_margin: number = 25;
    bottom_margin: number = 25;
    right_margin: number = 25;
    idToObjectMap: Map<string, string[]>; // Track object ids to their corresponding SVG element ids

    constructor(options: Partial<VisualizationConfig> = {}) {
        if (options.browser) {
            this.document = document;
        } else {
            this.document = new DOMImplementation().createDocument(
                "http://www.w3.org/1999/xhtml",
                "html",
                null
            );
        }

        this.svg = this.document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        if (options.width) {
            this.svg.setAttribute("width", options.width.toString());
            this.width = options.width;
        }
        if (options.height) {
            this.svg.setAttribute("height", options.height.toString());
            this.height = options.height;
        }
        this.roughjs_config = options.roughjs_config ?? {};
        this.rough_svg = rough.svg(this.svg, this.roughjs_config);

        // The user must not directly use this constructor; their only interaction should be with 'user_functions.draw'.
        for (const key in config) {
            (this as { [key: string]: any })[key] =
                Object.prototype.hasOwnProperty.call(options, key)
                    ? options[key as keyof VisualizationConfig]
                    : config[key as keyof typeof config];
        }

        this.objectCounter = 0;
        this.idToObjectMap = new Map();

        if (options.sort_by) {
            this.sort_by = options.sort_by;
        }
        if (options.padding !== undefined) {
            this.canvas_padding = options.padding;
        }
        if (options.top_margin !== undefined) {
            this.top_margin = options.top_margin;
        }
        if (options.left_margin !== undefined) {
            this.left_margin = options.left_margin;
        }
        if (options.bottom_margin !== undefined) {
            this.bottom_margin = options.bottom_margin;
        }
        if (options.right_margin !== undefined) {
            this.right_margin = options.right_margin;
        }

        setStyleSheet(this, options.global_style ?? "", options.theme);
    }

    /**
     * Serialize the generated SVG element into a readable string.
     *
     * @returns a readable string for the generated SVG element
     */
    serializeSVG(): string {
        const xmlSerializer = new XMLSerializer();
        return xmlSerializer.serializeToString(this.svg);
    }

    /**
     * Save the current image to an SVG file at the given path.
     * If path is undefined, write the svg to stdout instead.
     * @param path - The repository (local location that the image
     * will be saved).
     */
    save(path?: string): void {
        const xml = this.serializeSVG();
        if (path === undefined) {
            console.log(xml);
        } else {
            if (!fs) {
                throw new Error(
                    `Could not load path ${path} in this environment.`
                );
            }
            fs.writeFile(path, xml, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }

    /**
     * Render the image (show the output) SVG to a given canvas object.
     * @param canvas - the element that will be used to draw graphics
     */
    render(canvas: HTMLCanvasElement): void {
        const image = new Image();
        const data =
            "data:image/svg+xml;base64," + window.btoa(this.svg.toString());
        image.src = data;
        image.onload = () => {
            const ctx = canvas.getContext("2d");
            if (ctx !== null) {
                ctx.drawImage(image, 0, 0);
            }
        };
    }

    /**
     * Clear a given canvas object.
     * @param canvas - the element that is currently used to draw graphics
     */
    clear(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (ctx !== null) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * Distribute the object drawing depending on type
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param type - the data type (e.g. list, int) of the object we want draw
     * @param id - the hypothetical memory address number
     * @param value - can be passed as a list if type is a collection type
     * @param show_indexes - whether to show list indices
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * @param width - The width of the object
     * @param height - The height of the object
     * For style, firstly refer to `style.md` and `presets.md`. For the styling options in terms of texts, refer to
     * the SVG documentation. For the styling options in terms of boxes, refer to the Rough.js documentation.
     */
    drawObject(
        x: number,
        y: number,
        type: string,
        id: number | undefined | null,
        value: object | number[] | string | boolean | null,
        show_indexes: boolean = false,
        style: Style,
        width: number,
        height: number
    ): Rect {
        if (id === undefined) {
            id = null;
        }
        if (collections.includes(type)) {
            if (type === "dict" && typeof value === "object") {
                return this.drawDict(x, y, id, value, style, width, height);
            } else if (
                type === "set" &&
                isArrayOfNullableType<number>(value, "number")
            ) {
                return this.drawSet(x, y, id, value, style, width, height);
            } else if (
                (type === "list" || type === "tuple") &&
                isArrayOfNullableType<number>(value, "number")
            ) {
                return this.drawSequence(
                    x,
                    y,
                    type,
                    id,
                    value,
                    show_indexes,
                    style,
                    width,
                    height
                );
            }
        } else {
            if (typeof value !== "object" || value === null) {
                return this.drawPrimitive(
                    x,
                    y,
                    type,
                    id,
                    value,
                    style,
                    width,
                    height
                );
            }
        }
        throw new Error(
            `Invalid type or value: Expected a collection type (dict, set, list, tuple) or a primitive value, but received type "${type}" with value "${value}".`
        );
    }

    /**
     * Draw a primitive object.
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param type - the primitive data type (e.g. boolean, int) of the object we want draw
     * @param id - the hypothetical memory address number
     * @param value - the value of the primitive object
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * @param width - The width of the object
     * @param height - The height of the object
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawPrimitive(
        x: number,
        y: number,
        type: string,
        id: number | null,
        value: Primitive,
        style: Style,
        width: number,
        height: number
    ): Rect {
        this.drawRect(x, y, width, height, style.box_container, true, id);

        let size: Rect = {
            width: width,
            height: height,
            x: x,
            y: y,
        };

        if (immutable.includes(type)) {
            this.drawRect(
                // While no style argument is provided, the drawRect method manages this scenario automatically.
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                width + 2 * this.double_rect_sep,
                height + 2 * this.double_rect_sep
            );
            size = {
                width: width + 2 * this.double_rect_sep,
                height: height + 2 * this.double_rect_sep,
                x: x - this.double_rect_sep,
                y: y - this.double_rect_sep,
            };
        }

        let display_text: string;
        if (type === "bool") {
            display_text = value ? "True" : "False";
        } else if (type === "str") {
            display_text = JSON.stringify(value);
        } else {
            display_text = String(value);
        }

        if (value !== null && value !== undefined) {
            this.drawText(
                display_text,
                x + width / 2,
                y + (height + this.prop_min_height) / 2,
                style.text_value,
                "value"
            );
        }

        this.drawProperties(id, type, x, y, width, style);

        this.updateDimensions(size);

        return size;
    }

    /**
     * Draw the id and type properties of an object with a given type and id.
     * @param id - the hypothetical memory address number
     * @param type - the data type of the given object
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param width - The width of the given box (rectangle)
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawProperties(
        id: number | null,
        type: string,
        x: number,
        y: number,
        width: number,
        style: Style
    ) {
        const id_box = Math.max(
            this.prop_min_width,
            this.getTextLength(`id${id}`, style.text_id) + 10
        );

        const type_box = Math.max(
            this.prop_min_width,
            this.getTextLength(type, style.text_type) + 10
        );

        this.drawRect(x, y, id_box, this.prop_min_height, style.box_id);
        this.drawRect(
            x + width - type_box,
            y,
            type_box,
            this.prop_min_height,
            style.box_type
        );

        this.drawText(
            id === null ? "" : `id${id}`,
            x + id_box / 2,
            y + this.font_size * 1.5,
            style.text_id,
            "id"
        );

        this.drawText(
            type,
            x + width - type_box / 2,
            y + this.font_size * 1.5,
            style.text_type,
            "type"
        );
    }

    /**
     * Draw a sequence object (must be either a list or a tuple).
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param type - the data type of the given object (tuple or list)
     * @param id - the hypothetical memory address number
     * @param element_ids - the list of id's corresponding to the values stored in this set.
     *      NOTE:
     *          1. This argument MUST be an array, since the built-in 'forEach' method works only for
     *             (finite) ordered collections (i.e. with indexing). Sets are a type of unordered collection.
     *          2. The 'element_ids' argument must store the id's and not the actual value of the list elements.
     *             If the instructor wishes to showcase the corresponding values, it is their responsibility to create
     *             memory boxes for all elements (with id's that match the id's held in 'element_ids').
     *
     * @param show_idx - whether to show the indexes of each list element
     * @param style - object defining the desired style of the sequence. As described in the docstring of
     *            'drawAll', this must be in the form
     *            {text:
     *                  {value: {...}, id : {...}, type : {...}},
     *                  box: {container : {...}, id : {...}, type : {...}}
     *            }.
     *
     * Moreover, note that this program does not force that for every id in the element_ids argument there is
     * a corresponding object (and its memory box) in our canvas.
     *
     * @param style -  The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     * @param width - The width of the object
     * @param height - The height of the object-
     */
    drawSequence(
        x: number,
        y: number,
        type: string,
        id: number | null,
        element_ids: (number | null)[],
        show_idx: boolean,
        style: Style,
        width: number,
        height: number
    ): Rect {
        this.drawRect(x, y, width, height, style.box_container, true, id);

        const size: Rect = { width: width, height: height, x: x, y: y };

        if (immutable.includes(type)) {
            this.drawRect(
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                width + 2 * this.double_rect_sep,
                height + 2 * this.double_rect_sep
            );
        }

        let curr_x = x + this.item_min_width / 2;
        let item_y =
            y +
            this.prop_min_height +
            (this.obj_min_height -
                this.prop_min_height -
                this.item_min_height) /
                2;
        if (show_idx) {
            item_y += this.list_index_sep;
        }
        element_ids.forEach((v, i) => {
            const idv = v === null ? "" : `id${v}`;

            const element_box_style = style.box_compound?.[i] as Options;
            const element_text_style = style.text_compound?.[
                i
            ] as CSS.PropertiesHyphen;

            const item_length = Math.max(
                this.item_min_width,
                this.getTextLength(idv, style.text_id) + 10
            );
            this.drawRect(
                curr_x,
                item_y,
                item_length,
                this.item_min_height,
                element_box_style
            );
            this.drawText(
                idv,
                curr_x + item_length / 2,
                item_y + this.item_min_height / 2 + this.font_size / 4,
                element_text_style,
                "id"
            );
            if (show_idx) {
                this.drawText(
                    i.toString(),
                    curr_x + item_length / 2,
                    item_y - this.item_min_height / 4,
                    style.text_id,
                    "id"
                );
            }

            curr_x += item_length;
        });

        if (type === "list") {
            this.drawProperties(id, "list", x, y, width, style);
        } else {
            this.drawProperties(id, "tuple", x, y, width, style);
        }

        this.updateDimensions(size);

        return size;
    }

    /**
     * Draw a set object.
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param id - the hypothetical memory address number
     * @param element_ids - the list of id's corresponding to the values stored in this set.
     *      NOTE:
     *          1. This argument MUST be an array, since the built-in 'forEach' method works only for
     *             (finite) ordered collections (i.e. with indexing). Sets are a type of unordered collection.
     *          2. The 'element_ids' argument must store the id's and not the actual value of the list elements.
     *             If the instructor wishes to showcase the corresponding values, it is their responsibility to create
     *             memory boxes for all elements (with id's that match the id's held in 'element_ids').
     * @param style - object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     * @param width - The width of the object
     * @param height - The height of the object
     *
     * Moreover, note that this program does not force that for every id in the element_ids argument there is
     * a corresponding object (and its memory box) in our canvas.
     *
     * @returns the top-left coordinates, width, and height of the outermost box
     */
    drawSet(
        x: number,
        y: number,
        id: number | null,
        element_ids: (number | null)[],
        style: Style,
        width: number,
        height: number
    ): Rect {
        this.drawRect(x, y, width, height, style.box_container, true, id);

        const SIZE: Rect = {
            x,
            y,
            width: width,
            height: height,
        };

        let curr_x = x + this.item_min_width / 2;
        const item_y =
            y +
            this.prop_min_height +
            (height - this.prop_min_height - this.item_min_height) / 2;
        const item_text_y =
            item_y + this.item_min_height / 2 + this.font_size / 4;

        element_ids.forEach((v, i) => {
            const idv = v === null ? "" : `id${v}`;

            const element_box_style = style.box_compound?.[i] as Options;
            const element_text_style = style.text_compound?.[
                i
            ] as CSS.PropertiesHyphen;

            const item_length = Math.max(
                this.item_min_width,
                this.getTextLength(idv, style.text_id) + 10
            );
            this.drawRect(
                curr_x,
                item_y,
                item_length,
                this.item_min_height,
                element_box_style
            );
            this.drawText(
                idv,
                curr_x + item_length / 2,
                item_text_y,
                element_text_style,
                "id"
            );
            if (i > 0) {
                this.drawText(
                    ",",
                    curr_x - this.item_min_width / 8,
                    item_text_y,
                    {},
                    "default"
                );
            }
            curr_x += item_length + this.item_min_height / 4;
        });

        this.drawProperties(id, "set", x, y, width, style);
        this.drawText(
            "{",
            x + this.item_min_width / 4,
            item_text_y,
            {},
            "default"
        );
        this.drawText(
            "}",
            x + width - this.item_min_width / 4,
            item_text_y,
            {},
            "default"
        );

        this.updateDimensions(SIZE);

        return SIZE;
    }

    /**
     * Draw a dictionary object
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param id - the hypothetical memory address number
     * @param obj - the object that will be drawn
     * @param style - object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     * @param width - The width of the object
     * @param height - The height of the object
     *
     * @returns the top-left coordinates, width, and height of the outermost box
     */
    drawDict(
        x: number,
        y: number,
        id: number | null,
        obj: { [key: string]: any } | [any, any][] | null,
        style: Style,
        width: number,
        height: number
    ): Rect {
        this.drawRect(x, y, width, height, style.box_container, true, id);
        const SIZE: Rect = { x, y, width: width, height: height };

        const entries: [any, any][] = [];
        if (Array.isArray(obj)) {
            for (const item of obj) {
                if (!Array.isArray(item) || item.length !== 2) {
                    throw new Error(
                        "Invalid dict value: Expected a list of [key id, value id] pairs."
                    );
                }
                entries.push([item[0], item[1]]);
            }
        } else {
            for (const k in obj) {
                entries.push([k, obj[k]]);
            }
        }

        // First loop, to draw the key boxes
        let curr_y = y + this.prop_min_height + this.item_min_height / 2;
        let index = 0;
        for (const entry of entries) {
            let key_string: string;
            if (entry[0] === null || entry[0] === undefined) {
                key_string = "";
            } else if (typeof entry[0] === "string") {
                key_string = entry[0];
            } else {
                key_string = String(entry[0]);
            }
            const idk = key_string.trim() === "" ? "" : `id${key_string}`;

            const raw_box = style.box_compound?.[index];
            const raw_text = style.text_compound?.[index];

            let key_box_style: Options | undefined;
            let key_text_style: CSS.PropertiesHyphen | undefined;

            if (raw_box !== undefined && "key" in raw_box) {
                key_box_style = raw_box.key;
            }

            if (raw_text !== undefined && "key" in raw_text) {
                key_text_style = raw_text.key;
            }

            const key_box = Math.max(
                this.item_min_width,
                this.getTextLength(idk + 5, style.text_id)
            );

            // Draw the rectangles representing the keys.
            this.drawRect(
                x + this.obj_x_padding,
                curr_y,
                key_box,
                this.item_min_height,
                key_box_style
            );

            this.drawText(
                idk,
                x + this.item_min_width + 2,
                curr_y + this.item_min_height / 2 + +this.font_size / 4,
                key_text_style,
                "id"
            );

            curr_y += this.item_min_height * 1.5;
            index++;
        }

        // A second loop, so that we can position the colon and value boxes correctly.
        curr_y = y + this.prop_min_height + this.item_min_height / 2;
        index = 0;
        for (const entry of entries) {
            const idv = entry[1] === null ? "" : `id${entry[1]}`;

            const raw_box = style.box_compound?.[index];
            const raw_text = style.text_compound?.[index];

            let value_box_style: Options | undefined;
            let value_text_style: CSS.PropertiesHyphen | undefined;

            if (raw_box !== undefined && "value" in raw_box) {
                value_box_style = raw_box.value;
            }

            if (raw_text !== undefined && "value" in raw_text) {
                value_text_style = raw_text.value;
            }

            const value_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv + 5, style.text_value)
            );

            // Draw the rectangle for values.
            this.drawRect(
                x + width / 2 + this.font_size,
                curr_y,
                value_box,
                this.item_min_height,
                value_box_style
            );

            this.drawText(
                ":",
                x + width / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                {},
                "default"
            );

            this.drawText(
                idv,
                x + width / 2 + this.font_size + value_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                value_text_style,
                "id"
            );

            curr_y += this.item_min_height * 1.5;
            index++;
        }

        this.drawProperties(id, "dict", x, y, width, style);

        this.updateDimensions(SIZE);

        return SIZE;
    }

    /**
     * Draw a custom class.
     * @param  x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param name - the name of the class
     * @param id - the hypothetical memory address number
     * @param attributes - the attributes of the given class
     * @param stack_frame - set to true if you are drawing a stack frame
     * @param style - object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     * @param width - The width of the object
     * @param height - The height of the object
     *
     * @returns the top-left coordinates, width, and height of the outermost box
     */
    drawClass(
        x: number,
        y: number,
        name: string | undefined | null,
        id: number | undefined | null,
        attributes: { [key: string]: any },
        stack_frame: boolean,
        style: Style,
        width: number,
        height: number
    ): Rect {
        if (id === undefined) {
            id = null;
        }
        if (name === undefined || name === null) {
            name = "";
        }

        this.drawRect(x, y, width, height, style.box_container, true, id);

        const SIZE: Rect = { x, y, width: width, height: height };

        // Draw element boxes.
        let curr_y = y + this.prop_min_height + this.item_min_height / 2;
        for (const attribute in attributes) {
            const val = attributes[attribute];
            const idv = val === null ? "" : `id${val}`;
            const attr_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv) + 10
            );
            this.drawRect(
                x + width - this.item_min_width * 1.5,
                curr_y,
                attr_box,
                this.item_min_height
            );

            if (attribute.trim() !== "") {
                this.drawText(
                    attribute,
                    x + this.item_min_width / 2,
                    curr_y + this.item_min_height / 2 + this.font_size / 4,
                    style.text_value,
                    stack_frame ? "variable" : "attribute"
                );
            }

            this.drawText(
                idv,
                x + width - this.item_min_width * 1.5 + attr_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_id,
                "id"
            );
            curr_y += this.item_min_height * 1.5;
        }

        if (stack_frame) {
            const text_length = this.getTextLength(name, style.text_type);
            this.drawRect(
                x,
                y,
                text_length + 10,
                this.prop_min_height,
                style.box_container
            );
            this.drawText(
                name,
                x + text_length / 2 + 5,
                y + this.prop_min_height * 0.6,
                style.text_type,
                "type"
            );
        } else {
            this.drawProperties(id, name, x, y, width, style);
        }

        this.updateDimensions(SIZE);

        return SIZE;
    }

    /**
     * Draw a rectangle that will be used to represent the objects.
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param width - the width of the rectangle
     * @param height - the height of the rectangle
     * @param style - 1-D object with style properties for a Rough.js object, as per the
     *                        Rough.js API. For instance, {fill: 'blue', stroke: 'red'}.
     */
    drawRect(
        x: number,
        y: number,
        width: number,
        height: number,
        style?: Options,
        isBoundingBox: boolean = false,
        objectId?: number | null
    ): void {
        if (style === undefined) {
            style = this.rect_style;
        }

        // Set rect style with user and config overrides
        const rectStyle = {
            fillStyle: "solid",
            fill: "none",
            ...style,
            ...(this.roughjs_config?.options ?? {}),
        };

        const rectElement = this.rough_svg.rectangle(
            x,
            y,
            width,
            height,
            rectStyle
        );

        if (isBoundingBox) {
            rectElement.setAttribute("id", `object-${this.objectCounter}`);

            // Map object id value to the object counter id
            if (objectId !== null && objectId !== undefined) {
                const idKey = `id${objectId}`;
                if (!this.idToObjectMap.has(idKey)) {
                    this.idToObjectMap.set(idKey, []);
                }
                this.idToObjectMap
                    .get(idKey)!
                    .push(`object-${this.objectCounter}`);
            }

            this.objectCounter++;
        }

        this.svg.appendChild(rectElement);
    }

    /**
     * Draw given text
     * @param text - The text message that will be displayed
     * @param x - value for x coordinate of top left corner
     * @param y - value for y coordinate of top left corner
     * @param style -  1-D object with style properties for a svg object, as per the
     *                        standard SVG attributes, documented on
     *                        https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text.
     *                        For instance, {fill: 'blue', stroke: 'red'}
     * @param text_class - The CSS class (if any) of the text message to be drawn
     */

    drawText(
        text: string,
        x: number,
        y: number,
        style?: CSS.Properties,
        text_class?: string
    ): void {
        const newElement = this.document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        newElement.setAttribute("x", x.toString());
        newElement.setAttribute("y", y.toString());

        if (style !== undefined) {
            let new_style = "";
            for (const style_attribute of Object.keys(style)) {
                new_style += `${style_attribute}:${style[style_attribute as keyof CSS.Properties]}; `;
            }
            newElement.setAttribute("style", new_style);
        }

        newElement.appendChild(this.document.createTextNode(text));

        if (text_class !== null) {
            newElement.setAttribute("class", `${text_class}`);
        }

        this.svg.appendChild(newElement);
    }

    /**
     * Return the length of this text.
     * @param s - The given text.
     * @param textStyle - The style configuration for the text.
     */
    getTextLength(s: string, textStyle?: CSS.PropertiesHyphen): number {
        const fontSize = textStyle?.["font-size"];
        const sizeMapping: { [key: string]: number } = {
            "xx-small": 0.6,
            "x-small": 0.75,
            small: 0.89,
            medium: 1,
            large: 1.2,
            "x-large": 1.5,
            "xx-large": 2,
            "xxx-large": 3,
        };

        const parsed = parseInt(String(fontSize));

        if (!isNaN(parsed) && parsed > 0) {
            return s.length * parsed * 0.6;
        } else if (fontSize && String(fontSize) in sizeMapping) {
            return s.length * 12 * sizeMapping[fontSize as string];
        }

        return s.length * 12;
    }

    /**
     * Create a MemoryModel given a list of JS objects.
     *
     * @param objects - the list of objects (including stack-frames) to be drawn.
     * Each object in 'objects' must include  the following structure:
     * @param objects[*].x - Value for x coordinate of top left corner
     * @param objects[*].y - Value for y coordinate of top left corner
     * @param objects[*].type - Specifies whether a class, stack frame, or object is being drawn.
     *                                      To draw a class, input `.class` and to draw a stack frame, input `.frame`. If an
     *                                       object is being drawn, input the type of the object.
     * @param objects[*].name - The name of the class or stack frame to be drawn. Note that this attribute is only
     *                                  applicable if the object's type is `.class` or `.frame`. If no classes or stack frames
     *                                   are being drawn, this attribute can be excluded from the input.
     * @param objects[*].id - The id value of this object. If we are to draw a StackFrame, then this MUST be 'null'.
     * @param objects[*].value - The value of the object. This could be anything, from an empty string to a JS object,
     *                          which would be passed for the purpose of drawing a user-defined class object, a
     *                          stackframe, or a dictionary. Note that in such cases where we want to do draw a 'container'
     *                          object (an object that contains other objects), we pass a JS object where the keys are the
     *                          attributes/variables and the values are the id's of the corresponding objects (not the
     *                          objects themselves).
     * @param objects[*].show_indexes = false - Applicable only for drawing tuples or lists (when drawSequence
     *                                                     method will be used).
     *                                                     Whether the memory box of the underlying
     *                                                     sequence will include indices (for sequences) or not. This
     *                                                     has a default value of false, and it shall be manually set
     *                                                     only if the object corresponds to a sequence (list or
     *                                                     tuple).
     * @param objects[*].style - The style object with which the object will be rendered. Check the
     * `style.md` and `presets.md` documentation files in the `explanations` directory.
     *
     * Preconditions:
     *      - 'objects' is a valid object with the correct properties, as outlined above.
     */
    drawAll(objects: DrawnEntity[]): Rect[] {
        const sizes_arr: Rect[] = [];
        const parsed_objects: DrawnEntity[] = [];

        for (const rawObj of objects) {
            const result = DrawnEntitySchema.safeParse(rawObj);
            if (!result.success) {
                const pretty = prettifyError(result.error);
                throw new Error(pretty);
            }

            const obj = result.data;

            if (Array.isArray(obj.style)) {
                // Parsing the 'objects' array is essential, potentially converting preset keywords into the
                // current item's 'style' object.
                let styleSoFar = {};

                for (let el of obj.style) {
                    if (typeof el === "string") {
                        if (!(el in presets)) {
                            throw new Error(
                                `Style preset "${obj.style}" not found. Please refer to the documentation for available presets.`
                            );
                        }
                        el = presets[el];
                    }

                    // Note that, the later will take precedence over styleSoFar.
                    styleSoFar = merge(styleSoFar, el);
                }

                obj.style = styleSoFar;
            } else if (typeof obj.style === "string") {
                if (!(obj.style in presets)) {
                    throw new Error(
                        `Style preset "${obj.style}" not found. Please refer to the documentation for available presets.`
                    );
                }

                obj.style = presets[obj.style];
            }

            obj.style = { ...obj.style, ...this.roughjs_config?.options };
            parsed_objects.push(obj);
        }

        const strict_objects = this.setDimensionsAll(parsed_objects);

        for (const obj of strict_objects) {
            if (!isStyle(obj.style)) {
                throw new Error(
                    "The 'style' property of this DrawnEntity must be of type Style."
                );
            }

            const frame_types = [".frame", ".blank-frame"];
            if (frame_types.includes(obj.type!) || obj.type === ".class") {
                const is_frame = frame_types.includes(obj.type!);

                const size = this.drawClass(
                    obj.x!,
                    obj.y!,
                    obj.name,
                    obj.id,
                    obj.value,
                    is_frame,
                    obj.style,
                    obj.width,
                    obj.height
                );
                sizes_arr.push(size);
            } else {
                const size = this.drawObject(
                    obj.x!,
                    obj.y!,
                    obj.type!,
                    obj.id,
                    obj.value,
                    obj.show_indexes,
                    obj.style,
                    obj.width,
                    obj.height
                );
                sizes_arr.push(size);
            }
        }
        if (this.interactive) {
            this.setInteractivityScript();
        }

        return sizes_arr;
    }

    /**
     * Updates the SVG canvas dimensions by dynamically updating its width and height
     * to fit the given object. Only applies when dimensions are not fixed by the user.
     *
     * @param size - Contains the top left coordinates, width and height of the box
     */
    private updateDimensions(size: Rect): void {
        const right_edge = size.x + size.width + this.canvas_padding;
        const bottom_edge = size.y + size.height + this.canvas_padding;

        if (this.width !== undefined && right_edge > this.width) {
            this.width = right_edge;
            this.svg.setAttribute("width", this.width.toString());
        }
        if (this.height !== undefined && bottom_edge > this.height) {
            this.height = bottom_edge;
            this.svg.setAttribute("height", this.height.toString());
        }
    }

    /**
     * Returns a copy of the input objects with width, height, x and y coordinates set properly.
     *
     * @param objects - the list of objects (including stack frames) to be drawn.
     */
    private setDimensionsAll(objects: DrawnEntity[]): DrawnEntityStrict[] {
        const objects_with_dimensions: DrawnEntityWithDimensions[] = [];

        // Set width and height for all objects
        for (const object of objects) {
            // Get default width and height
            const default_dims = this.getDefaultDimensions(object);

            // Overwrite width and height if necessary
            const object_with_dimensions = this.setDimensions(
                object,
                default_dims.default_width,
                default_dims.default_height
            );

            objects_with_dimensions.push(object_with_dimensions);
        }

        const { stack_frames, other_items } = this.separateObjects(
            objects_with_dimensions
        );

        // Set x and y coordinates for all stack frames
        const { StackFrames, stackEndpoint } =
            this.setStackFrameCoordinates(stack_frames);

        // Set x and y coordinates for all other objects
        const objs = this.setOtherItemsCoordinates(
            other_items,
            this.sort_by ?? null,
            stackEndpoint
        );

        return [...StackFrames, ...objs];
    }

    /**
     * Returns the default width and height for a given DrawnEntity object,
     * based on its type and value. Delegates to the appropriate helper method
     * depending on whether the object is a class, collection, or primitive.
     *
     * @param object - The DrawnEntity to compute default dimensions for.
     * @returns An object with default_width and default_height properties.
     * @throws Error if the type or value is invalid.
     */
    private getDefaultDimensions(object: DrawnEntity): {
        default_width: number;
        default_height: number;
    } {
        if (object.type === undefined) {
            throw new Error(
                "The 'type' property of this DrawnEntity is undefined."
            );
        }

        if (!isStyle(object.style)) {
            throw new Error(
                "The 'style' property of this DrawnEntity must be of type Style."
            );
        }

        if (object.type === ".blank" || object.type === ".blank-frame") {
            return { default_width: 0, default_height: 0 };
        }
        if (object.type === ".frame" || object.type === ".class") {
            return this.getDefaultClassDimensions(
                object.name,
                object.value,
                object.style
            );
        } else if (collections.includes(object.type)) {
            if (object.type === "dict" && typeof object.value === "object") {
                return this.getDefaultDictDimensions(
                    object.value,
                    object.style
                );
            } else if (
                object.type === "set" &&
                isArrayOfNullableType<number>(object.value, "number")
            ) {
                return this.getDefaultSetDimensions(object.value, object.style);
            } else if (
                (object.type === "list" || object.type === "tuple") &&
                isArrayOfNullableType<number>(object.value, "number")
            ) {
                return this.getDefaultSequenceDimensions(
                    object.value,
                    object.style,
                    object.show_indexes ?? false
                );
            }
        } else {
            if (typeof object.value !== "object" || object.value === null) {
                return this.getDefaultPrimitiveDimensions(
                    object.value,
                    object.style
                );
            }
        }
        throw new Error(
            `Invalid type or value: Expected a collection type (dict, set, list, tuple) or a primitive value, but received type "${object.type}" with value "${object.value}".`
        );
    }

    /**
     * Returns the default width and height for a primitive DrawnEntity object.
     * The width is determined by the rendered text length and minimum object width,
     * and the height is set to the minimum object height.
     *
     * @param value - the value of the primitive object
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * @returns An object with default_width and default_height properties.
     */
    private getDefaultPrimitiveDimensions(
        value: Primitive,
        style: Style
    ): {
        default_width: number;
        default_height: number;
    } {
        const renderedText =
            typeof value === "string" ? `"${value}"` : String(value);

        const text_value = style.text_value ?? {};
        const default_width = Math.max(
            this.obj_min_width,
            this.getTextLength(renderedText, text_value) + this.obj_x_padding
        );
        const default_height = this.obj_min_height;
        return { default_width, default_height };
    }

    /**
     * Returns the default width and height for a sequence DrawnEntity object (list or tuple).
     * The width is based on the number and size of elements, and the height may include
     * extra space if indexes are shown.
     *
     * @param element_ids - the list of id's corresponding to the values stored in this sequence.
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * @param show_indexes - whether to show the indexes of each list element
     * @returns An object with default_width and default_height properties.
     */
    private getDefaultSequenceDimensions(
        element_ids: (number | null)[],
        style: Style,
        show_indexes: boolean
    ): {
        default_width: number;
        default_height: number;
    } {
        let default_width = this.obj_x_padding * 2;
        element_ids.forEach((v) => {
            default_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`, style.text_id) +
                    10
            );
        });
        default_width = Math.max(this.obj_min_width, default_width);
        let default_height = this.obj_min_height;
        if (show_indexes) {
            default_height += this.list_index_sep;
        }
        return { default_width, default_height };
    }

    /**
     * Returns the default width and height for a set DrawnEntity object.
     * The width is based on the number and size of elements, including space for separators,
     * and the height is set to the minimum object height.
     *
     * @param element_ids - the list of id's corresponding to the values stored in this set.
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * @returns An object with default_width and default_height properties.
     */
    private getDefaultSetDimensions(
        element_ids: (number | null)[],
        style: Style
    ): {
        default_width: number;
        default_height: number;
    } {
        let default_width = this.obj_x_padding * 2;
        element_ids.forEach((v) => {
            default_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`, style.text_id) +
                    10
            );
        });
        default_width = Math.max(this.obj_min_width, default_width);
        default_width += ((element_ids.length - 1) * this.item_min_width) / 4; // Space for separators
        const default_height = this.obj_min_height;
        return { default_width, default_height };
    }

    /**
     * Returns the default width and height for a dictionary DrawnEntity object.
     * The width is determined by the widest key-value pair, and the height is based on
     * the number of entries.
     *
     * @param dict_obj - the object that will be drawn
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * @returns An object with default_width and default_height properties.
     */
    private getDefaultDictDimensions(
        dict_obj: { [key: string]: any } | [any, any][] | null,
        style: Style
    ): {
        default_width: number;
        default_height: number;
    } {
        let default_width = this.obj_min_width;
        let default_height = this.prop_min_height + this.item_min_height / 2;

        const entries: [any, any][] = [];
        if (Array.isArray(dict_obj)) {
            for (const item of dict_obj) {
                if (!Array.isArray(item) || item.length !== 2) {
                    throw new Error(
                        "Invalid dict value: Expected a list of [key id, value id] pairs."
                    );
                }
                entries.push([item[0], item[1]]);
            }
        } else {
            for (const k in dict_obj) {
                entries.push([k, dict_obj[k]]);
            }
        }

        for (const entry of entries) {
            let key_string: string;
            if (entry[0] === null || entry[0] === undefined) {
                key_string = "";
            } else if (typeof entry[0] === "string") {
                key_string = entry[0];
            } else {
                key_string = String(entry[0]);
            }
            const idk = key_string.trim() === "" ? "" : `id${key_string}`;
            const idv = entry[1] === null ? "" : `id${entry[1]}`;

            const key_box = Math.max(
                this.item_min_width,
                this.getTextLength(idk + 5, style.text_id)
            );
            const value_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv + 5, style.text_value)
            );

            default_width = Math.max(
                default_width,
                this.obj_x_padding * 2 +
                    key_box +
                    value_box +
                    2 * this.font_size
            );
            default_height += 1.5 * this.item_min_height;
        }
        return { default_width, default_height };
    }

    /**
     * Returns the default width and height for a class or stack frame DrawnEntity object.
     * The width is determined by the longest attribute name or class name, and the height
     * is based on the number of attributes.
     *
     * @param name - the name of the class
     * @param attributes - the attributes of the given class
     * @param style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * @returns An object with default_width and default_height properties.
     */
    private getDefaultClassDimensions(
        name: string | undefined | null,
        attributes: { [key: string]: any },
        style: Style
    ): {
        default_width: number;
        default_height: number;
    } {
        if (name === undefined || name === null) {
            name = "";
        }
        let default_width = this.obj_min_width;
        let longest = 0;
        for (const attribute in attributes) {
            longest = Math.max(
                longest,
                this.getTextLength(attribute, style.text_value)
            );
        }
        if (longest > 0) {
            default_width = longest + this.item_min_width * 3;
        }
        default_width = Math.max(
            default_width,
            this.prop_min_width + this.getTextLength(name, style.text_type) + 10
        );

        let default_height = 0;
        if (Object.keys(attributes).length > 0) {
            default_height =
                ((this.item_min_width * 3) / 2) *
                    Object.keys(attributes).length +
                this.item_min_width / 2 +
                this.prop_min_height;
        } else {
            default_height = this.obj_min_height;
        }
        return { default_width, default_height };
    }

    /**
     * Validate and set the width and height of the given object.
     * If width and/or height are not provided, set them to default values.
     * If provided width and/or height are smaller than the default values, log a warning message
     * and set them to the default values.
     * @param object
     * @param default_width
     * @param default_height
     */
    private setDimensions(
        object: DrawnEntity,
        default_width: number,
        default_height: number
    ): DrawnEntityWithDimensions {
        // For primitive objects, object width and height accounts for the double rectangle separation
        if (
            (object.type === "int" ||
                object.type === "float" ||
                object.type === "str" ||
                object.type === "bool" ||
                object.type === "None" ||
                typeof object.value !== "object" ||
                object.value === null) &&
            object.type !== ".blank-frame" &&
            object.type !== "range"
        ) {
            if (object.width !== undefined) {
                object.width -= 2 * this.double_rect_sep;
            }
            if (object.height !== undefined) {
                object.height -= 2 * this.double_rect_sep;
            }
        }

        if (object.width === undefined || object.width < default_width) {
            if (object.width !== undefined && object.width < default_width) {
                console.warn(
                    `WARNING: provided width of object (${object.width}) is smaller than the required width` +
                        ` (${default_width}). The provided width has been overwritten in the generated diagram.`
                );
            }
            object.width = default_width;
        }
        if (object.height === undefined || object.height < default_height) {
            if (object.height !== undefined && object.height < default_height) {
                console.warn(
                    `WARNING: provided height of object (${object.height}) is smaller than the required height` +
                        ` (${default_height}). The provided height has been overwritten in the generated diagram.`
                );
            }
            object.height = default_height;
        }

        return object as DrawnEntityWithDimensions;
    }

    /**
     * Separates the items that were given into two categories as stack frames and objects.
     * The returned object has two attributes as 'stack_frames' and 'other_items'.
     * Each of these attributes are a list of objects that were originally given by the user.
     *
     * @param objects - The list of objects, including stack frames (if any) and other items, that
     * will be drawn
     * @returns an object separating between stack frames and the rest of the items.
     */
    private separateObjects(objects: DrawnEntityWithDimensions[]): {
        stack_frames: DrawnEntityWithDimensions[];
        other_items: DrawnEntityWithDimensions[];
    } {
        const stackFrames: DrawnEntityWithDimensions[] = [];
        const otherItems: DrawnEntityWithDimensions[] = [];

        const frame_types = [".frame", ".blank-frame"];

        for (const item of objects) {
            if (
                item.type === ".blank" &&
                (item.width === undefined || item.height === undefined)
            ) {
                console.warn(
                    "WARNING :: An object with type='.blank' or '.blank-frame' exists with missing dimension information " +
                        "(either the width or the height is missing). This object will be omitted in the memory model" +
                        " diagram."
                );
            } else if (
                item.type !== undefined &&
                frame_types.includes(item.type)
            ) {
                stackFrames.push(item);
            } else {
                otherItems.push(item);
            }
        }

        return { stack_frames: stackFrames, other_items: otherItems };
    }

    /**
     * Return the stack frames with generated x and y coordinates, as well as the minimum required
     * height for drawing the stack frames. The returned collection of stack frames is the augmented version
     * of the input such that the x and y coordinates of the stack frames are determined automatically.
     *
     * @param stack_frames - The list of stack frames that will be drawn
     * @returns - Returns the object consisting of two attributes as follows: stack frames which will be drawn
     * and required width for drawing all the stack frames. Notably, the last attribute will be useful
     * in terms of dynamically deciding the width and the height of the canvas.
     */
    private setStackFrameCoordinates(
        stack_frames: DrawnEntityWithDimensions[]
    ): {
        StackFrames: DrawnEntityStrict[];
        stackEndpoint: number;
    } {
        let min_required_height = this.top_margin;
        let stack_endpoint = 0;
        const draw_stack_frames: DrawnEntityStrict[] = [];

        for (const stack_frame of stack_frames) {
            const width: number = stack_frame.width;
            const height: number = stack_frame.height;

            if (width > stack_endpoint) {
                stack_endpoint = width;
            }

            if (stack_frame.type !== ".blank-frame") {
                if (stack_frame.x === undefined) {
                    stack_frame.x = this.left_margin;
                }
                if (stack_frame.y === undefined) {
                    stack_frame.y = min_required_height;
                }
                draw_stack_frames.push(stack_frame as DrawnEntityStrict);
            }

            min_required_height = height + min_required_height;
        }
        stack_endpoint += this.left_margin;
        if (
            this.height === undefined ||
            this.height < min_required_height + this.canvas_padding_bottom
        ) {
            this.height = min_required_height + this.canvas_padding_bottom;
        }

        return {
            StackFrames: draw_stack_frames,
            stackEndpoint: stack_endpoint,
        };
    }

    /**
     * Automatic generation of coordinates for passed objects.
     *
     * Given a list of DrawnEntity objects with width and height, this function returns
     * a copy of the input objects with generated x and y coordinates (corresponding to the top-left
     * corner of the object's box in the canvas).
     *
     * @param objs - list of DrawnEntity objects with width and height
     * @param sort_by - the sorting criterion; must be "height" or "id", otherwise no sorting takes place.
     * @param sf_endpoint - the x-coordinate of the right edge of the stackframe column; this will determine
     *                              where the object space begins.
     * @returns list of DrawnEntityStrict objects (where each object is now equipped with x-y coordinates).
     */
    private setOtherItemsCoordinates(
        objs: DrawnEntityWithDimensions[],
        sort_by: SortOptions | null,
        sf_endpoint: number
    ): DrawnEntityStrict[] {
        // Determining the minimum width of the canvas.
        let min_width = 0;
        let item_width: number;
        for (const item of objs) {
            if (
                (item.type === "int" ||
                    item.type === "float" ||
                    item.type === "str" ||
                    item.type === "bool" ||
                    item.type === "None" ||
                    typeof item.value !== "object" ||
                    item.value === null) &&
                item.type !== ".blank-frame"
            ) {
                item_width = item.width + 2 * this.double_rect_sep;
            } else {
                item_width = item.width;
            }
            if (item_width > min_width) {
                min_width = item_width;
            }
        }

        min_width += sf_endpoint + 2 * this.canvas_padding + 1;

        if (this.width !== undefined && this.width < min_width) {
            console.warn(
                `WARNING: provided width (${this.width}) is smaller than the required width` +
                    ` (${min_width}). The provided width has been overwritten` +
                    ` in the generated diagram.`
            );
            this.width = min_width;
        }

        // determining default width: should be 800 by default, but set to min_width if necessary
        const default_width = Math.min(min_width, 800);
        const max_width = this.width || default_width;

        const PADDING = this.canvas_padding;

        // The object space begins where the stackframe column ends (plus padding).
        if (sf_endpoint === undefined) {
            sf_endpoint = max_width * 0.2;
        }
        const START_X = sf_endpoint + PADDING;

        for (const item of objs) {
            if (
                item.type === ".blank" &&
                (item.width === undefined || item.height === undefined)
            ) {
                console.warn(
                    "WARNING :: An object with type='.blank' or '.blank-frame' exists with missing dimension information " +
                        "(either the width or the height is missing). This object will be omitted in the memory model" +
                        " diagram."
                );
            }

            // Dimensions of primitive objects are updated in the calculation of coordinates
            if (
                (item.type === "int" ||
                    item.type === "float" ||
                    item.type === "str" ||
                    item.type === "bool" ||
                    item.type === "None" ||
                    typeof item.value !== "object" ||
                    item.value === null) &&
                item.type !== "range"
            ) {
                item.width += 2 * this.double_rect_sep;
                item.height += 2 * this.double_rect_sep;
            }
        }

        /**
         * The 'sort' function optionally accepts a "compare" function used to determine the basis upon which to sort the array.
         * This "compare" function is created and assigned to the variable 'compareFunc' in the following switch statement.
         * @param a - an object in objs
         * @param b - another object in objs
         * @returns negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
         */
        let compareFunc: (
            a: DrawnEntityWithDimensions,
            b: DrawnEntityWithDimensions
        ) => number;

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

        let strict_objects: DrawnEntityStrict[] = [];

        let x_coord = START_X;
        let y_coord = this.top_margin;
        let is_manual = false;

        // Once a row is occupied, we must establish its height to determine the y-coordinate of the next row's boxes.
        let row_height: number;
        let curr_row_objects: DrawnEntityWithDimensions[] = [];
        for (const item of objs) {
            let hor_reach = x_coord + item.width + PADDING;

            if (hor_reach < max_width) {
                // Assume manual layout is enabled if at least one item has x and y coordinates already set
                if (item.x !== undefined && item.y !== undefined) {
                    is_manual = true;
                }
                if (item.x === undefined) {
                    item.x = x_coord;
                }
                if (item.y === undefined) {
                    item.y = y_coord;
                }

                curr_row_objects.push(item);
            } else {
                // In this case, we cannot fit this object in the current row, and must move to a new row.
                // Based on how objs is initialized, every item will have attributes width and height
                const tallest_object = curr_row_objects.reduce((p, c) =>
                    p.height >= c.height ? p : c
                );
                row_height = tallest_object.height + PADDING;

                curr_row_objects = [];

                x_coord = START_X;
                y_coord = y_coord + row_height;

                if (item.x === undefined) {
                    item.x = x_coord;
                }
                if (item.y === undefined) {
                    item.y = y_coord;
                }

                item.rowBreaker = true;

                hor_reach = x_coord + item.width + PADDING;

                curr_row_objects.push(item);
            }

            x_coord = hor_reach;
            strict_objects.push(item as DrawnEntityStrict);
        }

        const defaultObject: DrawnEntityStrict = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        const right_most_obj = strict_objects.reduce(
            (prev, curr) => (compareByRightness(prev, curr) <= 0 ? prev : curr),
            defaultObject
        );
        const down_most_obj = strict_objects.reduce(
            (prev, curr) =>
                compareByBottomness(prev, curr) <= 0 ? prev : curr,
            defaultObject
        );

        // compareByRightness and compareByBottomness didn't throw error, so right_most_obj and down_most_obj has attributes x, y, width, height
        let canvas_width =
            right_most_obj.x + right_most_obj.width + this.right_margin;
        let canvas_height =
            down_most_obj.y + down_most_obj.height + this.bottom_margin;

        // Set dimensions of primitive objects back to original values
        for (const strict_obj of strict_objects) {
            if (
                (strict_obj.type === "int" ||
                    strict_obj.type === "float" ||
                    strict_obj.type === "str" ||
                    strict_obj.type === "bool" ||
                    strict_obj.type === "None" ||
                    typeof strict_obj.value !== "object" ||
                    strict_obj.value === null) &&
                strict_obj.type !== "range"
            ) {
                strict_obj.width -= 2 * this.double_rect_sep;
                strict_obj.height -= 2 * this.double_rect_sep;
            }
        }

        // Additional -- to extend the program for the .blank option.
        strict_objects = strict_objects.filter((item) => {
            return item.type !== ".blank";
        });

        // Maintain backwards compatibility for canvas height and width if manual layout is enabled
        if (is_manual) {
            canvas_height = 0;
            canvas_width = 0;
        }

        // Update canvas width and height
        this.width = this.width ? this.width : canvas_width;
        if (
            this.height === undefined ||
            this.height < canvas_height + this.canvas_padding_bottom
        ) {
            this.height = canvas_height + this.canvas_padding_bottom;
        }
        this.svg.setAttribute("width", this.width.toString());
        this.svg.setAttribute("height", this.height.toString());

        return strict_objects;
    }

    /**
     * Add hover interactivity to the SVG on object IDs
     */
    setInteractivityScript(): void {
        const idToObjectMapping = Object.fromEntries(this.idToObjectMap);

        const script = `
            function enableInteractivity() {
                // Inject the id value to object id mapping into script
                const idToObjectMap = ${JSON.stringify(idToObjectMapping)};

                function highlightObject(objectId) {
                    const objectBox = document.getElementById(objectId);
                    if (!objectBox) {
                        return;
                    }

                    objectBox.classList.add('highlighted');
                }

                function removeHighlight(objectId) {
                    const objectBox = document.getElementById(objectId);
                    if (!objectBox) {
                        return;
                    }

                    objectBox.classList.remove('highlighted');
                }

                function addEventListeners() {
                    document.querySelectorAll('text.id').forEach(idText => {
                        const idValue = idText.textContent.trim();
                        if (!idValue || !idValue.startsWith('id')) {
                            return;
                        }

                        idText.addEventListener('mouseover', () => {
                            const objectIds = idToObjectMap[idValue];
                            if (objectIds) {
                                objectIds.forEach(highlightObject);
                            }
                        });

                        idText.addEventListener('mouseout', () => {
                            const objectIds = idToObjectMap[idValue];
                            if (objectIds) {
                                objectIds.forEach(removeHighlight);
                            }
                        });
                    });
                }

                addEventListeners();
            }

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', enableInteractivity);
            } else {
                enableInteractivity();
            }
        `;

        const scriptElement = this.document.createElementNS(
            "http://www.w3.org/2000/svg",
            "script"
        );
        scriptElement.textContent = script;
        this.svg.appendChild(scriptElement);
    }
}

/**
 * Compares objects 'a' and 'b' by their height (assuming they both have the "height" property).
 * This function returns a negative integer if 'a' is taller (so, by definition of how sort uses the comparison
 * function, it will prioritize 'a' over 'b'), 0 if they are equally tall, and positive if 'b' is taller.
 * @param a - an object
 * @param b - another object
 * @returns negative if 'a' is taller, 0 if they have the same height, and positive if 'b' is taller.
 */
function compareByHeight(
    a: DrawnEntityWithDimensions,
    b: DrawnEntityWithDimensions
): number {
    if (a.height === undefined || b.height === undefined) {
        throw new Error("Both objects must have 'height' property.");
    }
    return -(a.height - b.height);
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
function compareByID(
    a: DrawnEntityWithDimensions,
    b: DrawnEntityWithDimensions
): number {
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
function compareByRightness(
    a: DrawnEntityStrict,
    b: DrawnEntityStrict
): number {
    if (
        a.x === undefined ||
        a.width === undefined ||
        b.x === undefined ||
        b.width === undefined
    ) {
        throw new Error("Both objects must have 'x' and 'width' property.");
    }
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
 * @returns negative if 'a' is bottomer, 0 if 'a' and 'b' are equally bottom, and positive if b' is bottomer.
 */
function compareByBottomness(
    a: DrawnEntityStrict,
    b: DrawnEntityStrict
): number {
    if (
        a.y === undefined ||
        a.height === undefined ||
        b.y === undefined ||
        b.height === undefined
    ) {
        throw new Error("Both objects must have 'y' and 'height' property.");
    }
    const a_bottom_edge = a.y + a.height;
    const b_bottom_edge = b.y + b.height;
    return -(a_bottom_edge - b_bottom_edge);
}
