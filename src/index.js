// const fs = require("fs")
import fs from "fs"
import rough from "roughjs/bundled/rough.esm.js"

const { DOMImplementation, XMLSerializer } = require("@xmldom/xmldom")

class MemoryModel {
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
        this.svg.setAttribute("width", options.width || 800)
        this.svg.setAttribute("height", options.height || 800)
        this.rough_svg = rough.svg(this.svg)

        for (const key in config) {
            this[key] = options.hasOwnProperty(key) ? options[key] : config[key]
        }
    }

    /**
     * Save the current image to an SVG file at the given path.
     * If path is undefined, write the svg to stdout instead.
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
     * Render the image SVG to a given canvas object.
     */
    render(canvas) {
        const ctx = canvas.getContext("2d")
        var image = new Image()
        var data = "data:image/svg+xml;base64," + window.btoa(this.svg)
        image.src = data
        ctx.drawImage(image, 0, 0)
    }

    /**
     * Distribute the object drawing depending on type
     * @param x: optional value for x coordinate of top left corner
     * @param y: optional value for y coordinate of top left corner
     * @param type
     * @param id: memory address number
     * @param value: can be passed as a list if type is a collection type
     * @param show_indexes: whether to show list indices
     */
    drawObject(x, y, type, id, value, show_indexes) {
        if (collections.includes(type)) {
            if (type === "dict") {
                this.drawDict(x, y, id, value)
            } else if (type === "set") {
                this.drawSet(x, y, id, value)
            } else if (type === "list" || type === "tuple") {
                this.drawList(x, y, type, id, value, show_indexes)
            }
        } else {
            this.drawPrimitive(x, y, type, id, value)
        }
    }

    /**
     * Draw a primitive object.
     */
    drawPrimitive(x, y, type, id, value) {
        // Draw object box
        let box_width = Math.max(
            this.obj_min_width,
            this.getTextLength(String(value)) + this.obj_x_padding
        )
        this.drawRect(x, y, box_width, this.obj_min_height)

        // Draw double box for immutable types
        if (immutable.includes(type)) {
            this.drawRect(
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                box_width + 2 * this.double_rect_sep,
                this.obj_min_height + 2 * this.double_rect_sep
            )
        }

        let display_text
        if (type === "bool") {
            display_text = value ? "True" : "False"
        } else {
            display_text = JSON.stringify(value)
        }

        // Draw the value
        if (value !== null && value !== undefined) {
            this.drawText(
                display_text,
                x + box_width / 2,
                y + (this.obj_min_height + this.prop_min_height) / 2,
                this.value_color
            )
        }

        // Draw type and id boxes
        this.drawProperties(id, type, x, y, box_width)
    }

    /**
     * Draw id and type properties
     */
    drawProperties(id, type, x, y, width) {
        let id_box = Math.max(
            this.prop_min_width,
            this.getTextLength(`id${id}`) + 10
        )

        // adjust length of type name box
        let type_box = Math.max(
            this.prop_min_width,
            this.getTextLength(type) + 10
        )

        // Draw text
        this.drawText(
            id === null ? "" : `id${id}`,
            x + id_box / 2,
            y + this.font_size * 1.5,
            this.id_color
        )
        this.drawText(
            type,
            x + width - type_box / 2,
            y + this.font_size * 1.5,
            this.value_color
        )

        // Draw boxes
        this.drawRect(x, y, id_box, this.prop_min_height)
        this.drawRect(x + width - type_box, y, type_box, this.prop_min_height)
    }

    /**
     * Draw a list object
     * @param show_idx: whether to show the indexes of each list element
     */
    drawList(x, y, type, id, values, show_idx) {
        // Object width
        let box_width = this.obj_x_padding * 2
        values.forEach((v) => {
            box_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`) + 10
            )
        })
        box_width = Math.max(this.obj_min_width, box_width)

        // Box height
        let box_height = this.obj_min_height
        if (show_idx) {
            box_height += this.list_index_sep
        }

        // Draw box
        this.drawRect(x, y, box_width, box_height)
        if (immutable.includes(type)) {
            this.drawRect(
                x - this.double_rect_sep,
                y - this.double_rect_sep,
                box_width + 2 * this.double_rect_sep,
                box_height + 2 * this.double_rect_sep
            )
        }

        // Draw element boxes
        let curr_x = x + this.item_min_width / 2
        let item_y =
            y +
            this.prop_min_height +
            (this.obj_min_height -
                this.prop_min_height -
                this.item_min_height) /
                2 // y coordinate of list items
        if (show_idx) {
            item_y += this.list_index_sep
        }
        values.forEach((v, i) => {
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
                this.id_color
            )
            if (show_idx) {
                this.drawText(
                    i,
                    curr_x + item_length / 2,
                    item_y - this.item_min_height / 4,
                    this.text_color
                )
            }

            curr_x += item_length
        })

        // Draw type and id boxes
        this.drawProperties(id, "list", x, y, box_width)
    }

    /**
     * Draw a set object
     */
    drawSet(x, y, id, values) {
        // Object width
        let box_width = this.obj_x_padding * 2
        values.forEach((v) => {
            box_width += Math.max(
                this.item_min_width,
                this.getTextLength(v === null ? "" : `id${v}`) + 10
            )
        })
        box_width = Math.max(this.obj_min_width, box_width)
        box_width += ((values.length - 1) * this.item_min_width) / 4 // Space for separators

        // Draw box
        this.drawRect(x, y, box_width, this.obj_min_height)

        // Draw element boxes
        let curr_x = x + this.item_min_width / 2
        let item_y =
            y +
            this.prop_min_height +
            (this.obj_min_height -
                this.prop_min_height -
                this.item_min_height) /
                2 // y coordinate of list items
        let item_text_y = item_y + this.item_min_height / 2 + this.font_size / 4

        values.forEach((v, i) => {
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
                this.id_color
            )
            if (i > 0) {
                // Draw commas
                this.drawText(
                    ",",
                    curr_x - this.item_min_width / 8,
                    item_text_y,
                    this.text_color
                )
            }
            curr_x += item_length + this.item_min_height / 4
        })

        // Draw type and id boxes
        this.drawProperties(id, "set", x, y, box_width)
        // Draw set braces
        this.drawText(
            "{",
            x + this.item_min_width / 4,
            item_text_y,
            this.text_color
        )
        this.drawText(
            "}",
            x + box_width - this.item_min_width / 4,
            item_text_y,
            this.text_color
        )
    }

    /**
     * Draw a dictionary object
     */
    drawDict(x, y, id, obj) {
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
            this.drawRect(
                x + this.obj_x_padding,
                curr_y,
                key_box,
                this.item_min_height
            )
            this.drawText(
                idk,
                x + this.item_min_width + 2,
                curr_y + this.item_min_height / 2 + +this.font_size / 4,
                this.id_color
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
                this.value_color
            )

            this.drawRect(
                x + box_width / 2 + this.font_size,
                curr_y,
                value_box,
                this.item_min_height
            )
            this.drawText(
                idv,
                x + box_width / 2 + this.font_size + value_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                this.id_color
            )

            curr_y += this.item_min_height * 1.5
        }

        // Draw outer box
        this.drawRect(x, y, box_width, box_height)

        // Draw type and id boxes
        this.drawProperties(id, "dict", x, y, box_width)
    }

    /**
     * Draw a custom class.
     * @param stack_frame: set to true if you are drawing a stack frame
     */
    drawClass(x, y, name, id, attributes, stack_frame) {
        // Get object's width
        let box_width = this.obj_min_width
        let longest = 0
        for (const attribute in attributes) {
            longest = Math.max(longest, this.getTextLength(attribute))
        }
        if (longest > 0) {
            box_width = longest + this.item_min_width * 3
        }
        // Adjust for class name
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
        this.drawRect(x, y, box_width, box_height)

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

            this.drawText(
                attribute,
                x + this.item_min_width / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                this.text_color,
                "begin"
            )
            this.drawText(
                idv,
                x + box_width - this.item_min_width * 1.5 + attr_box / 2,
                curr_y + this.item_min_height / 2 + this.font_size / 4,
                this.id_color
            )
            curr_y += this.item_min_height * 1.5
        }

        // Draw type and id boxes
        if (stack_frame) {
            let text_length = this.getTextLength(name)
            this.drawRect(x, y, text_length + 10, this.prop_min_height)
            this.drawText(
                name,
                x + text_length / 2 + 5,
                y + this.prop_min_height * 0.6,
                this.text_color
            )
        } else {
            this.drawProperties(id, name, x, y, box_width)
        }
    }

    /**
     * Draw a rectangle
     */
    drawRect(x, y, width, height, style) {
        if (style === undefined) {
            style = this.rect_style
        }
        this.svg.appendChild(
            this.rough_svg.rectangle(x, y, width, height, style)
        )
    }

    /**
     * Draw given text
     */
    drawText(text, x, y, colour, align) {
        colour = colour || this.text_color
        align = align || "middle"
        const newElement = this.document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        )
        newElement.setAttribute("x", x)
        newElement.setAttribute("y", y)
        newElement.setAttribute("fill", colour)
        newElement.setAttribute("text-anchor", align)
        newElement.setAttribute("font-family", "Consolas, Courier")
        newElement.setAttribute("font-size", `${this.font_size}px`)
        newElement.appendChild(this.document.createTextNode(text))
        this.svg.appendChild(newElement)
    }

    /**
     * Return the length of this text
     */
    getTextLength(s) {
        return s.length * 12
    }
}

const config = {
    rect_style: { stroke: "rgb(0, 0, 0)" },
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

// Built-in data types
const immutable = ["int", "str", "tuple", "None", "bool", "float", "date"]
const collections = ["list", "set", "tuple", "dict"]

export default { MemoryModel, config }
