import rough from "roughjs";

import merge from "deepmerge";

import {
    collections,
    default_text_style,
    immutable,
    populateStyleObject,
    presets,
} from "./style";
import { config } from "./config";
import { DOMImplementation, XMLSerializer } from "@xmldom/xmldom";

// Dynamic import of Node fs module
let fs;
if (typeof window === "undefined") {
    fs = require("fs");
}

/** The class representing the memory model diagram of the given block of code. */
export class MemoryModel {
    /**
     * Create the memory model diagram.
     * @property {object} svg - An svg 'Element' object from the DOM (Document Object Model) module.
     *                          Scalable Vector Graphics (svg) is an image format based on geometry.
     * @property {object} rough_svg - Instantiating a RoughSVG object by passing the root svg node (this.svg) to the
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
    rough_svg: any;
    rect_style: object;
    text_color: string; // Default text color
    value_color: string; // Text color for primitive values
    id_color: string; // Text color for object ids
    item_min_width: number; // Minimum width of an item box in a collection
    item_min_height: number; // Minimum height of an item box in a collection
    obj_min_width: number; // Minimum width of object rectangle
    obj_min_height: number; // Minimum height of object rectangle
    prop_min_width: number; // Minimum width of type and id boxes
    prop_min_height: number; // Minimum height of type and id boxes
    obj_x_padding: number; // Minimum horizontal padding of object rectangle
    double_rect_sep: number; // Separation between double boxes around immutable objects
    list_index_sep: number; // Vertical offset for list index labels
    font_size: number; // Font size, in px
    browser: boolean; // Whether this library is being used in a browser context
    seed: number; // Seed for RoughJS generated shape(s). 0 if wanting randomness, between 1 and 2^31 otherwise.

    constructor(options?: any) {
        options = options || {};
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

        this.svg.setAttribute("width", options.width || 800);
        this.svg.setAttribute("height", options.height || 800);
        this.seed = options.seed || 0;
        this.rough_svg = rough.svg(this.svg, { options: { seed: this.seed } });

        // The user must not directly use this constructor; their only interaction should be with 'user_functions.draw'.
        for (const key in config) {
            this[key] = options.hasOwnProperty(key)
                ? options[key]
                : config[key];
        }
    }

    /**
     * Serialize the generated SVG element into a readable string.
     *
     * @returns {String} a readable string for the generated SVG element
     */
    serializeSVG(): String {
        const xmlSerializer = new XMLSerializer();
        return xmlSerializer.serializeToString(this.svg);
    }

    /**
     * Save the current image to an SVG file at the given path.
     * If path is undefined, write the svg to stdout instead.
     * @param path - The repository (local location that the image
     * will be saved).
     */
    save(path) {
        const xml = this.serializeSVG();
        if (path === undefined) {
            console.log(xml);
        } else {
            fs.writeFile(path, xml, (err) => {
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
    render(canvas) {
        let image = new Image();
        let data =
            "data:image/svg+xml;base64," + window.btoa(this.svg.toString());
        image.src = data;
        image.onload = () => {
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
        };
    }

    /**
     * Clear a given canvas object.
     * @param canvas - the element that is currently used to draw graphics
     */
    clear(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Distribute the object drawing depending on type
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {string} type - the data type (e.g. list, int) of the object we want draw
     * @param {number} id - the hypothetical memory address number
     * @param {*} value - can be passed as a list if type is a collection type
     * @param {boolean} show_indexes - whether to show list indices
     * @param {Object} style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For style, firstly refer to `style.md` and `presets.md`. For the styling options in terms of texts, refer to
     * the SVG documentation. For the styling options in terms of boxes, refer to the Rough.js documentation.
     */
    drawObject(x, y, type, id, value, show_indexes, style) {
        if (collections.includes(type)) {
            if (type === "dict") {
                return this.drawDict(x, y, id, value, style);
            } else if (type === "set") {
                return this.drawSet(x, y, id, value, style);
            } else if (type === "list" || type === "tuple") {
                return this.drawSequence(
                    x,
                    y,
                    type,
                    id,
                    value,
                    show_indexes,
                    style
                );
            }
        } else {
            return this.drawPrimitive(x, y, type, id, value, style);
        }
    }

    /**
     * Draw a primitive object.
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {string} type - the primitive data type (e.g. boolean, int) of the object we want draw
     * @param {number} id - the hypothetical memory address number
     * @param {*} value - the value of the primitive object
     * @param {Object} style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawPrimitive(x, y, type, id, value, style) {
        let box_width = Math.max(
            this.obj_min_width,
            this.getTextLength(String(value)) + this.obj_x_padding
        );
        this.drawRect(
            x,
            y,
            box_width,
            this.obj_min_height,
            style.box_container
        );

        let size = {
            width: box_width,
            height: this.obj_min_height,
            x: x,
            y: y,
        };

        if (immutable.includes(type)) {
            this.drawRect(
                // While no style argument is provided, the drawRect method manages this scenario automatically.
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                box_width + 2 * this.double_rect_sep,
                this.obj_min_height + 2 * this.double_rect_sep
            );
            size = {
                width: box_width + 2 * this.double_rect_sep,
                height: this.obj_min_height + 2 * this.double_rect_sep,
                x: x - this.double_rect_sep,
                y: y - this.double_rect_sep,
            };
        }

        let display_text;
        if (type === "bool") {
            display_text = value ? "True" : "False";
        } else {
            display_text = JSON.stringify(value);
        }

        if (value !== null && value !== undefined) {
            this.drawText(
                display_text,
                x + box_width / 2,
                y + (this.obj_min_height + this.prop_min_height) / 2,
                style.text_value
            );
        }

        this.drawProperties(id, type, x, y, box_width, style);

        return size;
    }

    /**
     * Draw the id and type properties of an object with a given type and id.
     * @param {number} id - the hypothetical memory address number
     * @param {string} type - the data type of the given object
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {number} width - The width of the given box (rectangle)
     * @param {Object} style - The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawProperties(id, type, x, y, width, style) {
        let id_box = Math.max(
            this.prop_min_width,
            this.getTextLength(`id${id}`) + 10
        );

        let type_box = Math.max(
            this.prop_min_width,
            this.getTextLength(type) + 10
        );

        this.drawText(
            id === null ? "" : `id${id}`,
            x + id_box / 2,
            y + this.font_size * 1.5,
            style.text_id
        );

        this.drawText(
            type,
            x + width - type_box / 2,
            y + this.font_size * 1.5,
            style.text_type
        );

        this.drawRect(x, y, id_box, this.prop_min_height, style.box_id);
        this.drawRect(
            x + width - type_box,
            y,
            type_box,
            this.prop_min_height,
            style.box_type
        );
    }

    /**
     * Draw a sequence object (must be either a list or a tuple).
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {string} type - the data type of the given object (tuple or list)
     * @param {number} id - the hypothetical memory address number
     * @param {number[]} element_ids - the list of id's corresponding to the values stored in this set.
     *      NOTE:
     *          1. This argument MUST be an array, since the built-in 'forEach' method works only for
     *             (finite) ordered collections (i.e. with indexing). Sets are a type of unordered collection.
     *          2. The 'element_ids' argument must store the id's and not the actual value of the list elements.
     *             If the instructor wishes to showcase the corresponding values, it is their responsibility to create
     *             memory boxes for all elements (with id's that match the id's held in 'element_ids').
     *
     * @param {boolean} show_idx - whether to show the indexes of each list element
     * @param {object} style - object defining the desired style of the sequence. As described in the docstring of
     *            'drawAll', this must be in the form
     *            {text:
     *                  {value: {...}, id : {...}, type : {...}},
     *                  box: {container : {...}, id : {...}, type : {...}}
     *            }.
     *
     * Moreover, note that this program does not force that for every id in the element_ids argument there is
     * a corresponding object (and its memory box) in our canvas.
     *
     * @param {Object} style -  The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawSequence(x, y, type, id, element_ids, show_idx, style) {
        let box_width = this.obj_x_padding * 2;

        element_ids.forEach((v) => {
            box_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`) + 10
            );
        });

        box_width = Math.max(this.obj_min_width, box_width);

        let box_height = this.obj_min_height;
        if (show_idx) {
            box_height += this.list_index_sep;
        }

        this.drawRect(x, y, box_width, box_height, style.box_container);

        const size = { width: box_width, height: box_height, x: x, y: y };

        if (immutable.includes(type)) {
            this.drawRect(
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                box_width + 2 * this.double_rect_sep,
                box_height + 2 * this.double_rect_sep
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
            const item_length = Math.max(
                this.item_min_width,
                this.getTextLength(idv) + 10
            );
            this.drawRect(curr_x, item_y, item_length, this.item_min_height);
            this.drawText(
                idv,
                curr_x + item_length / 2,
                item_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_value
            );
            if (show_idx) {
                this.drawText(
                    i,
                    curr_x + item_length / 2,
                    item_y - this.item_min_height / 4,
                    style.text_id
                );
            }

            curr_x += item_length;
        });

        if (type === "list") {
            this.drawProperties(id, "list", x, y, box_width, style);
        } else {
            this.drawProperties(id, "tuple", x, y, box_width, style);
        }

        return size;
    }

    /**
     * Draw a set object.
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {number} id - the hypothetical memory address number
     * @param {number[]} element_ids - the list of id's corresponding to the values stored in this set.
     *      NOTE:
     *          1. This argument MUST be an array, since the built-in 'forEach' method works only for
     *             (finite) ordered collections (i.e. with indexing). Sets are a type of unordered collection.
     *          2. The 'element_ids' argument must store the id's and not the actual value of the list elements.
     *             If the instructor wishes to showcase the corresponding values, it is their responsibility to create
     *             memory boxes for all elements (with id's that match the id's held in 'element_ids').
     * @param {object} style - object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     *
     * Moreover, note that this program does not force that for every id in the element_ids argument there is
     * a corresponding object (and its memory box) in our canvas.
     *
     * @returns {number[]} the top-left coordinates, width, and height of the outermost box
     */
    drawSet(x, y, id, element_ids, style) {
        let box_width = this.obj_x_padding * 2;
        element_ids.forEach((v) => {
            box_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`) + 10
            );
        });
        box_width = Math.max(this.obj_min_width, box_width);
        box_width += ((element_ids.length - 1) * this.item_min_width) / 4; // Space for separators

        this.drawRect(
            x,
            y,
            box_width,
            this.obj_min_height,
            style.box_container
        );

        const SIZE = { x, y, width: box_width, height: this.obj_min_height };

        let curr_x = x + this.item_min_width / 2;
        let item_y =
            y +
            this.prop_min_height +
            (this.obj_min_height -
                this.prop_min_height -
                this.item_min_height) /
                2;
        let item_text_y =
            item_y + this.item_min_height / 2 + this.font_size / 4;

        element_ids.forEach((v, i) => {
            const idv = v === null ? "" : `id${v}`;
            const item_length = Math.max(
                this.item_min_width,
                this.getTextLength(idv) + 10
            );
            this.drawRect(curr_x, item_y, item_length, this.item_min_height);
            this.drawText(
                idv,
                curr_x + item_length / 2,
                item_text_y,
                style.text_value
            );
            if (i > 0) {
                this.drawText(
                    ",",
                    curr_x - this.item_min_width / 8,
                    item_text_y,
                    default_text_style
                );
            }
            curr_x += item_length + this.item_min_height / 4;
        });

        this.drawProperties(id, "set", x, y, box_width, style);
        this.drawText(
            "{",
            x + this.item_min_width / 4,
            item_text_y,
            default_text_style
        );
        this.drawText(
            "}",
            x + box_width - this.item_min_width / 4,
            item_text_y,
            default_text_style
        );

        return SIZE;
    }

    /**
     * Draw a dictionary object
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {number} id - the hypothetical memory address number
     * @param {object} obj - the object that will be drawn
     * @param {object} style - object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     *
     * @returns {object} the top-left coordinates, width, and height of the outermost box
     */
    drawDict(x, y, id, obj, style) {
        let box_width = this.obj_min_width;
        let box_height = this.prop_min_height + this.item_min_height / 2;

        let curr_y = y + this.prop_min_height + this.item_min_height / 2;
        for (const k in obj) {
            let idk = k === null ? "" : `id${k}`;
            let idv = k === null || obj[k] === null ? "" : `id${obj[k]}`;

            let key_box = Math.max(
                this.item_min_width,
                this.getTextLength(idk + 5)
            );
            let value_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv + 5)
            );

            // Draw the rectangles representing the keys.
            this.drawRect(
                x + this.obj_x_padding,
                curr_y,
                key_box,
                this.item_min_height
            );

            this.drawText(
                idk,
                x + this.item_min_width + 2,
                curr_y + this.item_min_height / 2 + +this.font_size / 4,
                style.text_value
            );

            curr_y += this.item_min_height * 1.5;

            box_width = Math.max(
                box_width,
                this.obj_x_padding * 2 +
                    key_box +
                    value_box +
                    2 * this.font_size
            );
            box_height += 1.5 * this.item_min_height;
        }

        // A second loop, so that we can position the colon and value boxes correctly.
        curr_y = y + this.prop_min_height + this.item_min_height / 2;
        for (const k in obj) {
            let idv = k === null || obj[k] === null ? "" : `id${obj[k]}`;

            let value_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv + 5)
            );

            this.drawText(
                ":",
                x + box_width / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                { fill: this.text_color }
            );

            // Draw the rectangle for values.
            this.drawRect(
                x + box_width / 2 + this.font_size,
                curr_y,
                value_box,
                this.item_min_height
            );

            this.drawText(
                idv,
                x + box_width / 2 + this.font_size + value_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_value
            );

            curr_y += this.item_min_height * 1.5;
        }

        this.drawRect(x, y, box_width, box_height, style.box_container);
        const SIZE = { x, y, width: box_width, height: box_height };

        this.drawProperties(id, "dict", x, y, box_width, style);

        return SIZE;
    }

    /**
     * Draw a custom class.
     * @param  {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {string} name - the name of the class
     * @param {string} id - the hypothetical memory address number
     * @param {object} attributes - the attributes of the given class
     * @param {boolean} stack_frame - set to true if you are drawing a stack frame
     * @param {object} style - object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     *
     * @returns {number[]} the top-left coordinates, width, and height of the outermost box
     */
    drawClass(x, y, name, id, attributes, stack_frame, style) {
        let box_width = this.obj_min_width;
        let longest = 0;
        for (const attribute in attributes) {
            longest = Math.max(longest, this.getTextLength(attribute));
        }
        if (longest > 0) {
            box_width = longest + this.item_min_width * 3;
        }
        box_width = Math.max(
            box_width,
            this.prop_min_width + this.getTextLength(name) + 10
        );

        let box_height = 0;
        if (Object.keys(attributes).length > 0) {
            box_height =
                ((this.item_min_width * 3) / 2) *
                    Object.keys(attributes).length +
                this.item_min_width / 2 +
                this.prop_min_height;
        } else {
            box_height = this.obj_min_height;
        }
        this.drawRect(x, y, box_width, box_height, style.box_container);

        const SIZE = { x, y, width: box_width, height: box_height };

        // Draw element boxes.
        let curr_y = y + this.prop_min_height + this.item_min_height / 2;
        for (const attribute in attributes) {
            const val = attributes[attribute];
            let idv = val === null ? "" : `id${val}`;
            let attr_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv) + 10
            );
            this.drawRect(
                x + box_width - this.item_min_width * 1.5,
                curr_y,
                attr_box,
                this.item_min_height
            );

            if (!stack_frame) {
                if (!style.text_value.hasOwnProperty("fill")) {
                    style.text_value["fill"] = this.text_color;
                }
                if (!style.text_value.hasOwnProperty("text-anchor")) {
                    style.text_value["text-anchor"] = "start";
                }
            }

            this.drawText(
                attribute,
                x + this.item_min_width / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_value
            );
            this.drawText(
                idv,
                x + box_width - this.item_min_width * 1.5 + attr_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_id
            );
            curr_y += this.item_min_height * 1.5;
        }

        if (stack_frame) {
            let text_length = this.getTextLength(name);
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
                style.text_type
            );
        } else {
            this.drawProperties(id, name, x, y, box_width, style);
        }

        return SIZE;
    }

    /**
     * Draw a rectangle that will be used to represent the objects.
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {number} width - the width of the rectangle
     * @param {number} height - the height of the rectangle
     * @param {object | undefined} style - 1-D object with style properties for a Rough.js object, as per the
     *                        Rough.js API. For instance, {fill: 'blue', stroke: 'red'}.
     */
    drawRect(
        x: number,
        y: number,
        width: number,
        height: number,
        style?: object
    ) {
        if (style === undefined) {
            style = this.rect_style;
        }
        style = { ...style, seed: this.seed };

        this.svg.appendChild(
            this.rough_svg.rectangle(x, y, width, height, style)
        );
    }

    /**
     * Draw given text
     * @param {string} text - The text message that will be displayed
     * @param {number} x - value for x coordinate of top left corner
     * @param {number} y - value for y coordinate of top left corner
     * @param {Object} style -  1-D object with style properties for a svg object, as per the
     *                        standard SVG attributes, documented on
     *                        https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text.
     *                        For instance, {fill: 'blue', stroke: 'red'}
     */

    drawText(text, x, y, style) {
        style["x"] = x;
        style["y"] = y;

        for (const style_attribute of Object.keys(default_text_style)) {
            if (!style.hasOwnProperty(style_attribute)) {
                style[style_attribute] = default_text_style[style_attribute];
            }
        }

        const newElement = this.document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        for (const style_attribute of Object.keys(style)) {
            newElement.setAttribute(style_attribute, style[style_attribute]);
        }

        newElement.appendChild(this.document.createTextNode(text));
        this.svg.appendChild(newElement);
    }

    /**
     * Return the length of this text.
     * @param {string} s - The given text.
     */
    getTextLength(s) {
        return s.length * 12;
    }

    /**
     * Create a MemoryModel given a list of JS objects.
     *
     * @param {object[]} objects - the list of objects (including stack-frames) to be drawn.
     * Each object in 'objects' must include  the following structure:
     * @param {boolean} objects[*].isClass = false - Whether a user-defined class (or a stack-frame) or a built-in
     *                                      object will be drawn. Pass true to draw a class or a stack-frame,
     *                                      and false to draw any of the types found in the 'immutable'
     *                                      and 'collections' constants. This has a default value of false and should
     *                                      be manually set to true only when drawing a class or stack-frame.
     * @param {number} objects[*].x - Value for x coordinate of top left corner
     * @param {number} objects[*].y - Value for y coordinate of top left corner
     * @param {string} objects[*].name - The name of the class or stack frame to be drawn. Note that this attribute is only
     *                                  applicable if the object's 'isClass' attribute is true. If no classes or stack frames
     *                                   are being drawn, this attribute can be excluded from the input.
     * @param {string} objects[*].type - The type of the object to be drawn. If no objects are being drawn, this attribute
     *                                   can be excluded from the input.
     * @param {number} objects[*].id - The id value of this object. If we are to draw a StackFrame, then this MUST be 'null'.
     * @param {*} objects[*].value - The value of the object. This could be anything, from an empty string to a JS object,
     *                          which would be passed for the purpose of drawing a user-defined class object, a
     *                          stackframe, or a dictionary. Note that in such cases where we want to do draw a 'container'
     *                          object (an object that contains other objects), we pass a JS object where the keys are the
     *                          attributes/variables and the values are the id's of the corresponding objects (not the
     *                          objects themselves).
     * @param {boolean=} objects[*].stack_frame = null - Whether a stack frame will be drawn or not. NOTE that this is only
     *                                            applicable if the object's 'isClass' attribute is true (since the
     *                                            'MemoryModel.drawClass' covers both classes and stack-frames). By default,
     *                                            'stack_frame' is set to null.
     * @param {boolean=} objects[*].show_indexes = false - Applicable only for drawing tuples or lists (when drawSequence
     *                                                     method will be used).
     *                                                     Whether the memory box of the underlying
     *                                                     sequence will include indices (for sequences) or not. This
     *                                                     has a default value of false, and it shall be manually set
     *                                                     only if the object corresponds to a sequence (list or
     *                                                     tuple).
     * @param {object} objects[*].style - The style object with which the object will be rendered. Check the
     * `style.md` and `presets.md` documentation files in the `explanations` directory.
     *
     * Preconditions:
     *      - 'objects' is a valid object with the correct properties, as outlined above.
     */
    drawAll(objects) {
        const sizes_arr = [];

        for (const obj of objects) {
            if (Array.isArray(obj.style)) {
                // Parsing the 'objects' array is essential, potentially converting preset keywords into the
                // current item's 'style' object.
                let styleSoFar = {};

                for (let el of obj.style) {
                    if (typeof el === "string") {
                        el = presets[el];
                    }

                    // Note that, the later will take precedence over styleSoFar.
                    styleSoFar = merge(styleSoFar, el);
                }

                obj.style = styleSoFar;
            }

            obj.style = populateStyleObject(obj, this.seed);

            if (obj.type === ".class" || obj.type === ".frame") {
                let is_frame = obj.type === ".frame";

                const size = this.drawClass(
                    obj.x,
                    obj.y,
                    obj.name,
                    obj.id,
                    obj.value,
                    is_frame,
                    obj.style
                );
                sizes_arr.push(size);
            } else {
                const size = this.drawObject(
                    obj.x,
                    obj.y,
                    obj.type,
                    obj.id,
                    obj.value,
                    obj.show_indexes,
                    obj.style
                );
                sizes_arr.push(size);
            }
        }

        return sizes_arr;
    }
}
