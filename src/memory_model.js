// A library allowing interaction with the file system (e.g. creating new files)
import fs from "fs"
// The library allowing for the production of sketches that appear to be hand-drawn
import rough from "roughjs/bundled/rough.esm.js"

// The library for merging js objects (will be used for populating styles)
const merge = require('deepmerge')

const {populateStyleObject, immutable, collections, presets, default_text_style} = require("./style")
const {config} = require("./config")

const { DOMImplementation, XMLSerializer } = require("@xmldom/xmldom")

/** The class representing the memory model diagram of the given block of code. */
class MemoryModel {
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
     *       Moreover, the user can optionally set custom width and height for the canvas by passing them as attributes
     *       to the 'options' argument. To see this in practice, see ./examples/demo.js.
     *
     */
    constructor(options) {
        options = options || {}
        if (options.browser) {
            this.document = document
        } else {
            this.document = new DOMImplementation().createDocument(
                "http://www.w3.org/1999/xhtml",
                "html",
                null
            )
        }

        this.svg = this.document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        )

        // Defining 'this.width', 'this.height', and 'this.rough_svg'.
        this.svg.setAttribute("width", options.width || 800)
        this.svg.setAttribute("height", options.height || 800)
        this.rough_svg = rough.svg(this.svg)

        // 'config' is a constant object holding configuration information, defined in the bottom of this file.
        // In particular, 'config' contains all properties that a 'MemoryModel' object must have, ---as well as their
        // corresponding default values---. However, with the 'options' parameter, the user has the ability to override
        // these default values by passing in a custom object with the desired attribute values.
        // For instance, if the user runs
        //                      m = new MemoryModel({font_size: 17}),
        // then the default 'font_size' value of 20 will be overridden and 'm.font_size' will evaluate to 17.
        for (const key in config) {
            this[key] = options.hasOwnProperty(key) ? options[key] : config[key]
        }
    }

    /**
     * Save the current image to an SVG file at the given path.
     * If path is undefined, write the svg to stdout instead.
     * @param path: The repository (local location that the image
     * will be saved).
     */
    save(path) {
        const xmlSerializer = new XMLSerializer()
        let xml = xmlSerializer.serializeToString(this.svg)
        if (path === undefined) {
            console.log(xml)
        } else {
            fs.writeFile(path, xml, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        }
    }

    /**
     * Render the image (show the output) SVG to a given canvas object.
     * @param canvas: the element that will be used to draw graphics
     */
    render(canvas) {
        const ctx = canvas.getContext("2d")
        let image = new Image()
        let data = "data:image/svg+xml;base64," + window.btoa(this.svg)
        image.src = data
        ctx.drawImage(image, 0, 0)
    }

    /**
     * Distribute the object drawing depending on type
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {string} type: the data type (e.g. list, int) of the object we want draw
     * @param {number} id: the hypothetical memory address number
     * @param {*} value: can be passed as a list if type is a collection type
     * @param {boolean} show_indexes: whether to show list indices
     * @param {Object} style: The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawObject(x, y, type, id, value, show_indexes, style) {
        if (collections.includes(type)) {  // If the given object is a collection
            if (type === "dict") {
                return this.drawDict(x, y, id, value, style)
            } else if (type === "set") {
                return this.drawSet(x, y, id, value, style)
            } else if (type === "list" || type === "tuple") {
                return this.drawSequence(x, y, type, id, value, show_indexes, style)
            }
        } else {  // If the given object is a primitive data type
            return this.drawPrimitive(x, y, type, id, value, style)
        }
    }


    /**
     * Draw a primitive object.
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {string} type: the primitive data type (e.g. boolean, int) of the object we want draw
     * @param {number} id: the hypothetical memory address number
     * @param {*} value: the value of the primitive object
     * @param {Object} style: The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawPrimitive(x, y, type, id, value, style) {
        // Adjust and draw object box (see 'config' object for the information on the attributes)
        let box_width = Math.max(
            this.obj_min_width,
            this.getTextLength(String(value)) + this.obj_x_padding
        )
        this.drawRect(x, y, box_width, this.obj_min_height, style.box_container)

        // The value that refers to the size and coordinates of the box, it will be used for automating the layout.
        let size = {width: box_width, height: this.obj_min_heigth, x: x, y: y};

        // For immutable types we need a double box, so we add another box that will contain the one we created.
        // Coordinate-wise, we utilize 'this.double_rec_sep' (see 'config' for more information).
        // It represents the space to leave between the inner box and the outer box.
        if (immutable.includes(type)) {
            this.drawRect(
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                box_width + 2 * this.double_rect_sep,
                this.obj_min_height + 2 * this.double_rect_sep
            )
            // The rectangle whose size will be recorded should be outer one.
            size = {width: box_width + 2 * this.double_rect_sep,
                height: this.obj_min_height + 2 * this.double_rect_sep,
                x: x - this.double_rect_sep,
                y: y - this.double_rect_sep};
        }

        // Initializing the text that will be displayed, using the 'type' and 'value' arguments.
        let display_text
        if (type === "bool") {
            display_text = value ? "True" : "False"
        } else {
            display_text = JSON.stringify(value)
        }

        // Actually drawing the text to be displayed on our canvas by utilizing the helper 'drawText' instance method.
        // Note that if the value is null or undefined, nothing will be drawn
        if (value !== null && value !== undefined) {
            this.drawText(
                display_text,
                x + box_width / 2,
                y + (this.obj_min_height + this.prop_min_height) / 2,
                style.text_value
            )
        }

        // Draw type and id boxes
        this.drawProperties(id, type, x, y, box_width, style)

        return size;
    }

    /**
     * Draw the id and type properties of an object with a given type and id.
     * @param {number} id: the hypothetical memory address number
     * @param {string} type: the data type of the given object
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {number} width: The width of the given box (rectangle)
     * @param {Object} style: The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawProperties(id, type, x, y, width, style) {

        // Adjust the id box by taking into account 'this.min_width'.
        let id_box = Math.max(
            this.prop_min_width,
            this.getTextLength(`id${id}`) + 10
        )

        // Adjust the id box by taking into account 'this.prop_min_width'.
        let type_box = Math.max(
            this.prop_min_width,
            this.getTextLength(type) + 10
        )

        // Draw the text inside the id box (insert the id of the given object to the id box)
        this.drawText(
            id === null ? "" : `id${id}`,
            x + id_box / 2,
            y + this.font_size * 1.5,
            style.text_id
        )

        // Draw the text inside the type box (insert the data type of the given object to the id box)
        this.drawText(
            type,
            x + width - type_box / 2,
            y + this.font_size * 1.5,
             style.text_type
        )

        // Draw boxes (specify the boxes for id and type)
        this.drawRect(x, y, id_box, this.prop_min_height, style.box_id)
        this.drawRect(x + width - type_box, y, type_box, this.prop_min_height, style.box_type)
    }

    /**
     * Draw a sequence object (must be either a list or a tuple).
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {string} type: the data type of the given object (tuple or list)
     * @param {number} id: the hypothetical memory address number
     * @param {number[]} element_ids: the list of id's corresponding to the values stored in this set.
     *      NOTE:
     *          1. This argument MUST be an array, since the built-in 'forEach' method works only for
     *             (finite) ordered collections (i.e. with indexing). Sets are a type of unordered collection.
     *          2. The 'element_ids' argument must store the id's and not the actual value of the list elements.
     *             If the instructor wishes to showcase the corresponding values, it is their responsibility to create
     *             memory boxes for all elements (with id's that match the id's held in 'element_ids').
     *
     * @param {boolean} show_idx: whether to show the indexes of each list element
     * @param {object} style: object defining the desired style of the sequence. As described in the docstring of
     *            'drawAll', this must be in the form
     *            {text:
     *                  {value: {...}, id : {...}, type : {...}},
     *                  box: {container : {...}, id : {...}, type : {...}}
     *            }.
     *
     * Moreover, note that this program does not force that for every id in the element_ids argument there is
     * a corresponding object (and its memory box) in our canvas.
     *
     * @param {Object} style: The style configuration for the drawings on the canvas (e.g. highlighting, bold texts)
     * For the styling options in terms of texts, refer to the SVG documentation. For the styling options in terms of
     * boxes, refer to the Rough.js documentation.
     */
    drawSequence(x, y, type, id, element_ids, show_idx, style) {

        // Object width
        let box_width = this.obj_x_padding * 2

        // For each element of 'element_ids', we increase 'box_width' as required, to make space for all values.
        element_ids.forEach((v) => {  // v represents one single value
            box_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`) + 10
            )
        })

        // Final 'box_width' adjustment; ensuring the box is at least as wide as required by 'this.obj_min_width'.
        box_width = Math.max(this.obj_min_width, box_width)

        // Box height
        let box_height = this.obj_min_height
        if (show_idx) {
            box_height += this.list_index_sep
        }

        // Draw box
        this.drawRect(x, y, box_width, box_height, style.box_container)

        // The value that refers to the size and coordinates of the box, it will be used for automating the layout.
        const size = {width: box_width, height: box_height, x: x, y: y};

        // As with all primitives, we are drawing a second enclosing box to highlight that this object is immutable
        if (immutable.includes(type)) {
            this.drawRect(
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                box_width + 2 * this.double_rect_sep,
                box_height + 2 * this.double_rect_sep
            )
        }

        // Draw the boxes for each element
        let curr_x = x + this.item_min_width / 2
        let item_y =
            y +
            this.prop_min_height +
            (this.obj_min_height -
                this.prop_min_height -
                this.item_min_height) /
            2  // y coordinate of list items
        if (show_idx) {
            item_y += this.list_index_sep
        }
        element_ids.forEach((v, i) => {
            const idv = v === null ? "" : `id${v}`
            const item_length = Math.max(
                this.item_min_width,
                this.getTextLength(idv) + 10
            )
            this.drawRect(curr_x, item_y, item_length, this.item_min_height)
            this.drawText(
                idv,
                curr_x + item_length / 2,
                item_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_value
            )
            if (show_idx) {
                this.drawText(
                    i,
                    curr_x + item_length / 2,
                    item_y - this.item_min_height / 4,
                    style.text_id
                )
            }

            curr_x += item_length
        })

        // Draw type and id boxes
        if (type === "list") {
            this.drawProperties(id, "list", x, y, box_width, style);
        } else {
            this.drawProperties(id, "tuple", x, y, box_width, style);
        }

        return size;
    }

    /**
     * Draw a set object.
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {number} id: the hypothetical memory address number
     * @param {number[]} element_ids: the list of id's corresponding to the values stored in this set.
     *      NOTE:
     *          1. This argument MUST be an array, since the built-in 'forEach' method works only for
     *             (finite) ordered collections (i.e. with indexing). Sets are a type of unordered collection.
     *          2. The 'element_ids' argument must store the id's and not the actual value of the list elements.
     *             If the instructor wishes to showcase the corresponding values, it is their responsibility to create
     *             memory boxes for all elements (with id's that match the id's held in 'element_ids').
     * @param {object} style: object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     *
     * Moreover, note that this program does not force that for every id in the element_ids argument there is
     * a corresponding object (and its memory box) in our canvas.
     *
     * @returns {number[]} the top-left coordinates, width, and height of the outermost box
     */
    drawSet(x, y, id, element_ids, style) {

        // Adjust the object width (the width of the box)
        let box_width = this.obj_x_padding * 2
        element_ids.forEach((v) => { // v represents each value in this collection
            box_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`) + 10
            )
        })
        box_width = Math.max(this.obj_min_width, box_width)
        box_width += ((element_ids.length - 1) * this.item_min_width) / 4 // Space for separators

        // Draw box which represents the set object
        this.drawRect(x, y, box_width, this.obj_min_height, style.box_container)

        // the value to be returned in the end of this function -- this is required information for automating the layout
        const SIZE = {x, y, width: box_width, height: this.obj_min_height}

        // Draw element boxes for each value in this collection
        let curr_x = x + this.item_min_width / 2
        let item_y =
            y +
            this.prop_min_height +
            (this.obj_min_height -
                this.prop_min_height -
                this.item_min_height) /
            2 // y coordinate of list items
        let item_text_y = item_y + this.item_min_height / 2 + this.font_size / 4

        element_ids.forEach((v, i) => {
            const idv = v === null ? "" : `id${v}`
            const item_length = Math.max(
                this.item_min_width,
                this.getTextLength(idv) + 10
            )
            this.drawRect(curr_x, item_y, item_length, this.item_min_height)
            this.drawText(
                idv,
                curr_x + item_length / 2,
                item_text_y,
                style.text_value
            )
            if (i > 0) {
                // Draw commas
                this.drawText(
                    ",",
                    curr_x - this.item_min_width / 8,
                    item_text_y,
                    default_text_style
                )
            }
            curr_x += item_length + this.item_min_height / 4
        })

        // Draw type and id boxes
        this.drawProperties(id, "set", x, y, box_width, style)
        // Draw set braces
        this.drawText(
            "{",
            x + this.item_min_width / 4,
            item_text_y,
            default_text_style
        )
        this.drawText(
            "}",
            x + box_width - this.item_min_width / 4,
            item_text_y,
            default_text_style
        )

        return SIZE;
    }

    /**
     * Draw a dictionary object
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {number} id: the hypothetical memory address number
     * @param {object} obj: the object that will be drawn
     * @param {object} style: object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     *
     * @returns {object} the top-left coordinates, width, and height of the outermost box
     */
    drawDict(x, y, id, obj, style) {
        let box_width = this.obj_min_width
        let box_height = this.prop_min_height + this.item_min_height / 2

        // Draw element boxes
        let curr_y = y + this.prop_min_height + this.item_min_height / 2
        for (const k in obj) {
            let idk = k === null ? "" : `id${k}`
            let idv = k === null || obj[k] === null ? "" : `id${obj[k]}`

            let key_box = Math.max(
                this.item_min_width,
                this.getTextLength(idk + 5)
            )
            let value_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv + 5)
            )

            // Draw the rectangles representing the keys
            this.drawRect(
                x + this.obj_x_padding,
                curr_y,
                key_box,
                this.item_min_height
            )

            // Draw the text inside the keys
            this.drawText(
                idk,
                x + this.item_min_width + 2,
                curr_y + this.item_min_height / 2 + +this.font_size / 4,
                style.text_value
            )

            curr_y += this.item_min_height * 1.5

            // Update dimensions
            box_width = Math.max(
                box_width,
                this.obj_x_padding * 2 +
                key_box +
                value_box +
                2 * this.font_size
            )
            box_height += 1.5 * this.item_min_height
        }

        // A second loop, so that we can position the colon and value boxes correctly
        curr_y = y + this.prop_min_height + this.item_min_height / 2
        for (const k in obj) {
            let idv = k === null || obj[k] === null ? "" : `id${obj[k]}`

            let value_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv + 5)
            )

            // Draw colon
            this.drawText(
                ":",
                x + box_width / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                {fill: this.text_color}
            )

            // Draw the rectangle for values
            this.drawRect(
                x + box_width / 2 + this.font_size,
                curr_y,
                value_box,
                this.item_min_height
            )

            // Draw the text for the values
            this.drawText(
                idv,
                x + box_width / 2 + this.font_size + value_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_value
            )

            curr_y += this.item_min_height * 1.5
        }

        // Draw outer box
        this.drawRect(x, y, box_width, box_height, style.box_container)
        // the value to be returned in the end of this function -- this is required information for automating the layout
        const SIZE = {x, y, width: box_width, height: box_height}

        // Draw type and id boxes
        this.drawProperties(id, "dict", x, y, box_width, style);

        return SIZE;
    }

    /**
     * Draw a custom class.
     * @param  {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {string} name: the name of the class
     * @param {string} id: the hypothetical memory address number
     * @param {object} attributes: the attributes of the given class
     * @param {boolean} stack_frame: set to true if you are drawing a stack frame
     * @param {object} style: object defining the desired style of the sequence. Must abide by the structure defined
     *            in 'drawAll'.
     *
     * @returns {number[]} the top-left coordinates, width, and height of the outermost box
     */
    drawClass(x, y, name, id, attributes, stack_frame, style) {
        // Get object's width
        let box_width = this.obj_min_width
        let longest = 0
        for (const attribute in attributes) {
            longest = Math.max(longest, this.getTextLength(attribute))
        }
        if (longest > 0) {
            box_width = longest + this.item_min_width * 3
        }
        // Adjust for the class name
        box_width = Math.max(
            box_width,
            this.prop_min_width + this.getTextLength(name) + 10
        )

        // Get object's height
        let box_height = 0
        if (Object.keys(attributes).length > 0) {
            box_height =
                ((this.item_min_width * 3) / 2) *
                Object.keys(attributes).length +
                this.item_min_width / 2 +
                this.prop_min_height
        } else {
            box_height = this.obj_min_height
        }
        this.drawRect(x, y, box_width, box_height, style.box_container)

        // The value to be returned in the end of this function, this is required information for automating the layout
        const SIZE = {x, y, width: box_width, height: box_height}

        // Draw element boxes
        let curr_y = y + this.prop_min_height + this.item_min_height / 2 // y coordinate of list items
        for (const attribute in attributes) {
            const val = attributes[attribute]
            let idv = val === null ? "" : `id${val}`
            let attr_box = Math.max(
                this.item_min_width,
                this.getTextLength(idv) + 10
            )
            this.drawRect(
                x + box_width - this.item_min_width * 1.5,
                curr_y,
                attr_box,
                this.item_min_height
            )

            if (!stack_frame){

                if (!style.text_value.hasOwnProperty("fill")) {
                    style.text_value["fill"] = this.text_color;
                }
                if (!style.text_value.hasOwnProperty("text-anchor")) {
                    style.text_value["text-anchor"] = "begin";
                }
            }

            this.drawText(
                attribute,
                x + this.item_min_width / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_value
            )

            this.drawText(
                idv,
                x + box_width - this.item_min_width * 1.5 + attr_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                style.text_id
            )
            curr_y += this.item_min_height * 1.5
        }

        // Draw type and id boxes
        if (stack_frame) {
            let text_length = this.getTextLength(name)
            this.drawRect(x, y, text_length + 10, this.prop_min_height, style.box_container)
            this.drawText(
                name,
                x + text_length / 2 + 5,
                y + this.prop_min_height * 0.6,
                style.text_type
            )
        } else {
            this.drawProperties(id, name, x, y, box_width, style)
        }

        return SIZE;
    }

    /**
     * Draw a rectangle that will be used to represent the objects.
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {number} width: the width of the rectangle
     * @param {number} height: the height of the rectangle
     * @param {object | undefined} style: 1-D object with style properties for a Rough.js object, as per the
     *                        Rough.js API. For instance, {fill: 'blue', stroke: 'red'}.
     */
    drawRect(x, y, width, height, style) {
        if (style === undefined) {
            style = this.rect_style;
        }

        // In the invocation of 'this.rough_svg.rectangle()', passing in the style object means that the provided
        // styling specifics will be automatically applied to the SVG, due to the rough library.
        this.svg.appendChild(
            this.rough_svg.rectangle(x, y, width, height, style)
        )
    }

    /**
     * Draw given text
     * @param {string} text: The text message that will be displayed
     * @param {number} x: value for x coordinate of top left corner
     * @param {number} y: value for y coordinate of top left corner
     * @param {Object} style:  1-D object with style properties for a svg object, as per the
     *                        standard SVG attributes, documented on
     *                        https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text.
     *                        For instance, {fill: 'blue', stroke: 'red'}
     */

    drawText(text, x, y, style) {

        // Setting up the x and y values inside the style object
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
        )

        for (const style_attribute of Object.keys(style)) {
            newElement.setAttribute(style_attribute, style[style_attribute])
        }


        newElement.appendChild(this.document.createTextNode(text))
        this.svg.appendChild(newElement)
    }

    /**
     * Return the length of this text.
     * @param {string} s: The given text.
     */
    getTextLength(s) {
        return s.length * 12
    }


    /**
     * Create a MemoryModel given a list of JS objects.
     *
     * @param {object[]} objects: the list of objects (including stack-frames) to be drawn.
     * Each object in 'objects' must include  the following structure:
     * @param {boolean} objects[*].isClass: Whether a user-defined class (or a stack-frame) or a built-in
     *                                      object will be drawn. Pass true to draw a class or a stack-frame,
     *                                      and false to draw any of the types found in the 'immutable'
     *                                      and 'collections' constants.
     * @param {number} objects[*].x: Value for x coordinate of top left corner
     * @param {number} objects[*].y: Value for y coordinate of top left corner
     * @param {string} objects[*].name: The type of the object to draw (if isClass===true, then this is the name of the
     *                                  corresponding class or stackframe).
     * @param {number} objects[*].id: The id value of this object. If we are to draw a StackFrame, then this MUST be 'null'.
     * @param {*} objects[*].value: The value of the object. This could be anything, from an empty string to a JS object,
     *                          which would be passed for the purpose of drawing a user-defined class object, a
     *                          stackframe, or a dictionary. Note that in such cases where we want to do draw a 'container'
     *                          object (an object that contains other objects), we pass a JS object where the keys are the
     *                          attributes/variables and the values are the id's of the corresponding objects (not the
     *                          objects themselves).
     * @param {boolean=} [objects[*].stack_frame = null]: Whether a stack frame will be drawn or not. NOTE that this is only
     *                                            applicable if the object's 'isClass' attribute is true (since the
     *                                            'MemoryModel.drawClass' covers both classes and stack-frames). By default,
     *                                            'stack_frame' is set to null.
     * @param {boolean=} [objects[*].show_indexes = false]:Applicable only for drawing tuples or lists (when drawSequence
     *                                                     method will be used).
     *                                                     Whether the memory box of the underlying
     *                                                     sequence will include indices (for sequences) or not. This
     *                                                     has a default value of false, and it shall be manually set
     *                                                     only if the object corresponds to a sequence (list or
     *                                                     tuple).
     *
     *
     *
     * Preconditions:
     *      - 'objects' is a valid object with the correct properties, as outlined above.
     */
    drawAll(objects) {
        const sizes_arr = [];

        for (const obj of objects) { // i takes the values of 0 to n-1, where n is the length of the inputted list
            // If the input is an array, it means that the user has specified a list of presets and custom objects
            // (any combination of these).
            if (Array.isArray(obj.style)) {
                // Inside this body, we need to "parse" the 'objects' array, since it may include preset keywords (that
                // are strings). In this case, the string corresponding to the preset must be converted to the
                // actual 'style' object that the present represents.
                let styleSoFar = {}

                /*
                PURPOSE OF FOR LOOP:
                    Beginning with an empty (style) object ('styleSoFar'), the for loop gradually fill the object with
                    properties by merging the current object with the current loop object
                    We need to "parse" the 'objects' array, since it may include preset keywords (that
                    are strings). In this case, the string corresponding to the preset must be converted to the
                    actual 'style' object that the present represents.

                    NOTE:
                        Crucially, inside the 'objects' list, the higher the index of an object, the higher its precedence.
                        For example, if obj.style is the list
                            [
                                {'text_id' : {'font-size':'large'},
                                {'text_id' : {'font-size':'small'}
                            ],
                        the final style object (which is being mutated throughout the loop) will have
                        {'text_id' : {'font-size':'small'}, since the second object has higher precedence than the first
                        one. This is a result of the behavior of the deepmerge.merge function.
                 */
                for (let el of obj.style) {

                    // We need to convert the string keyword to the actual underlying 'style' object
                    if (typeof el === "string") {
                        el = presets[el];
                    }

                    // Merging the accumulator 'styleSoFar' with the current loop variable object, el.
                    styleSoFar = merge(styleSoFar, el)

                }

                // Reassigning obj.style to the final produced 'styleSoFar' object. This way, obj.style now has the
                // appropriate structure to be passed to 'populateStyleObject' for any additional structural additions.
                obj.style =  styleSoFar;
            }


            // ----------- Setting default values for the three attributes of obj.style.text -----------
            obj.style = populateStyleObject(obj);

                if (obj.isClass) {  // The 'drawClass' method will be used to draw a class (or a stack-frame)
                    // MemoryModel.drawClass returns the location and dimensions of the drawn object, so the below
                    // line both mutates 'this', and assigns the returned value to the variable 'size'.
                    const size = this.drawClass(obj.x, obj.y, obj.name, obj.id, obj.value, obj.stack_frame, obj.style);
                    sizes_arr.push(size);
                } else {  // The 'drawObject' method will be used to draw an object of a built-in type.
                    const size = this.drawObject(obj.x, obj.y, obj.name, obj.id, obj.value, obj.show_indexes, obj.style);
                    sizes_arr.push(size);
                }
        }

        return sizes_arr;
    }

    /**
     * Create a MemoryModel given the path to a JSON file.
     * The JSON file must contain a list of objects, exactly like the input to the function 'drawAll' (see
     * the string of 'drawAll' for detailed information on the required format of this list of objects).
     *
     * @param {string} path - the path to the JSON file.
     *
     */
    createFromJSON(path) {
        // Use of fs.readFileSync(<path>, <options>) which synchronously reads and returns a string of the data stored
        // in the file that corresponds to path. It blocks execution of any other code until the file is read.
        const json_string = fs.readFileSync(path, "utf-8");

        // Since fs.readFileSync returns a string, we then use JSON.parse in order to convert the return JSON string
        // into a valid JavaScript object (we assume that 'path' is the path to a valid JSON file).
        const listOfObjs = JSON.parse(json_string);

        // Since we now have our list of objects, we simply reuse the previously created 'drawAll' method.
        this.drawAll(listOfObjs); // reusing the 'drawAll' function
    }
}


export { MemoryModel }
