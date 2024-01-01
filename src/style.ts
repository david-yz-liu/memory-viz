import merge from "deepmerge";
import { config } from "./config";

// Built-in style for drawing text on canvas (if no style is provided by the user).
const default_text_style = {
    fill: config.text_color,
    "text-anchor": "middle",
    "font-family": "Consolas, Courier",
    "font-size": config.font_size,
};

// Default style attributes that apply universally to any type of data.
const common_style = {
    text_id: {
        fill: config.id_color,
        "text-anchor": "middle",
        "font-family": "Consolas, Courier",
        "font-size": config.font_size,
    },
    text_type: {
        fill: config.value_color,
        "text-anchor": "middle",
        "font-family": "Consolas, Courier",
        "font-size": config.font_size,
    },
    text_value: {
        "text-anchor": "middle",
        "font-family": "Consolas, Courier",
        "font-size": config.font_size,
    },
    box_container: {},
    box_id: {},
    box_type: {},
};

const category_specific_styles = {
    collection: {
        text_value: { fill: config.id_color },
    },
    primitive: {
        text_value: { fill: config.value_color },
    },
    class: {
        text_value: { fill: config.value_color, "text-anchor": "start" },
    },
    stackframe: {
        text_value: { fill: config.text_color, "text-anchor": "start" },
    },
};

const immutable = ["int", "str", "tuple", "None", "bool", "float", "date"];
const collections = ["list", "set", "tuple", "dict"];

const primitives = ["int", "str", "None", "bool", "float", "date"];

/**
 * Populates a user-passed style object --to the extent needed-- with default data (to adhere to the interface of the
 * style object). Needed to avoid errors of the type "TypeError: Cannot set properties of undefined (setting 'x')", as
 * well as many more.
 * @param {Object} object : the object that represents a Python object the user wants drawn. The style object
 *                          corresponding to 'object' will be extracted be doing object.style.
 * @returns {Object}
 */
function populateStyleObject(object, seed?) {
    let style_so_far = common_style;

    let object_type;

    if (primitives.includes(object.name)) {
        object_type = "primitive";
    } else if (collections.includes(object.name)) {
        object_type = "collection";
    } else if (object.stack_frame) {
        object_type = "stackframe";
    } else {
        object_type = "class";
    }

    // We then add properties specific to the different type categories.
    // Note that, the later will take precedence over styleSoFar.
    style_so_far = merge(style_so_far, category_specific_styles[object_type]);

    // Finally, we complement the current style with any user-supplied properties.
    // Note that, the later will take precedence over styleSoFar.
    style_so_far = merge(style_so_far, object.style || {});

    return { ...style_so_far, seed: seed };
}

// Constants employed to establish presets for styles.
const HIGHLIGHT_TEXT = { "font-weight": "bolder", "font-size": "22px" };
const FADE_TEXT = { /*'font-weight': "normal",*/ "fill-opacity": 0.4 };
const HIGHLIGHT_BOX_LINES = { roughness: 0.2, strokeWidth: 4 };
const HIGHLIGHT_BOX = {
    roughness: 0.2,
    strokeWidth: 4,
    fill: "yellow",
    fillStyle: "solid",
};
const FADE_BOX_LINES = { roughness: 2.0, strokeWidth: 0.5 };
const FADE_BOX = {
    roughness: 2.0,
    strokeWidth: 0.5,
    fill: "rgb(247, 247, 247)",
    fillStyle: "solid",
};
const HIDE_BOX = { fill: "white", fillStyle: "solid" };

const presets = {
    highlight: {
        text_value: HIGHLIGHT_TEXT,
        text_id: HIGHLIGHT_TEXT,
        text_type: HIGHLIGHT_TEXT,
        box_id: HIGHLIGHT_BOX_LINES,
        box_type: HIGHLIGHT_BOX_LINES,
        box_container: HIGHLIGHT_BOX,
    },
    highlight_id: {
        text_id: HIGHLIGHT_TEXT,
        box_id: HIGHLIGHT_BOX,
    },
    highlight_type: {
        text_type: HIGHLIGHT_TEXT,
        box_type: HIGHLIGHT_BOX,
    },
    fade: {
        text_value: FADE_TEXT,
        text_id: FADE_TEXT,
        text_type: FADE_TEXT,
        box_id: FADE_BOX_LINES,
        box_type: FADE_BOX_LINES,
        box_container: FADE_BOX,
    },
    fade_id: {
        text_id: FADE_TEXT,
        box_id: FADE_BOX_LINES,
    },
    fade_type: {
        text_type: FADE_TEXT,
        box_type: FADE_BOX_LINES,
    },
    hide: {
        box_container: HIDE_BOX,
        box_id: HIDE_BOX,
        box_type: HIDE_BOX,
    },
    hide_id: {
        box_id: HIDE_BOX,
    },
    hide_type: {
        box_type: HIDE_BOX,
    },
    hide_container: {
        box_container: HIDE_BOX,
    },
};

export {
    populateStyleObject,
    immutable,
    collections,
    primitives,
    presets,
    default_text_style,
};
