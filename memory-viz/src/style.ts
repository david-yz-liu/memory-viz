import merge from "deepmerge";
import { config } from "./config";
import { DrawnEntity, AttributeStyle, Style } from "./types";

// Built-in style for drawing text on canvas (if no style is provided by the user).
const default_text_style: AttributeStyle = {
    fill: config.text_color,
    "text-anchor": "middle",
    "font-family": "Consolas, Courier",
    "font-size": config.font_size,
};

const immutable: Array<string> = [
    "int",
    "str",
    "tuple",
    "None",
    "bool",
    "float",
    "date",
];
const collections: Array<string> = ["list", "set", "tuple", "dict"];

const primitives: Array<string> = [
    "int",
    "str",
    "None",
    "bool",
    "float",
    "date",
];

// Constants employed to establish presets for styles.
const HIGHLIGHT_TEXT: AttributeStyle = {
    "font-weight": "bolder",
    "font-size": "22px",
};
const FADE_TEXT: AttributeStyle = {
    /*'font-weight': "normal",*/ "fill-opacity": 0.4,
};
const HIDE_TEXT: AttributeStyle = { "fill-opacity": 0 };
const HIGHLIGHT_BOX_LINES: AttributeStyle = { roughness: 0.2, strokeWidth: 4 };
const HIGHLIGHT_BOX: AttributeStyle = {
    roughness: 0.2,
    strokeWidth: 4,
    fill: "yellow",
    fillStyle: "solid",
};
const FADE_BOX_LINES: AttributeStyle = { roughness: 2.0, strokeWidth: 0.5 };
const FADE_BOX: AttributeStyle = {
    roughness: 2.0,
    strokeWidth: 0.5,
    fill: "rgb(247, 247, 247)",
    fillStyle: "solid",
};
const HIDE_BOX: AttributeStyle = { fill: "white", fillStyle: "solid" };

const presets: Record<string, Style> = {
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
        text_value: HIDE_TEXT,
        text_id: HIDE_TEXT,
        text_type: HIDE_TEXT,
        box_container: HIDE_BOX,
        box_id: HIDE_BOX,
        box_type: HIDE_BOX,
    },
    hide_id: {
        text_id: HIDE_TEXT,
        box_id: HIDE_BOX,
    },
    hide_type: {
        text_type: HIDE_TEXT,
        box_type: HIDE_BOX,
    },
    hide_container: {
        text_value: HIDE_TEXT,
        box_container: HIDE_BOX,
    },
};

export { immutable, collections, primitives, presets, default_text_style };
