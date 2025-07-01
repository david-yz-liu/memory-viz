import merge from "deepmerge";
import { config } from "./config";
import { Style } from "./types";
import type * as CSS from "csstype";
import { MemoryModel } from "./memory_model";
import { Options } from "roughjs/bin/core";

const immutable: string[] = [
    "int",
    "str",
    "tuple",
    "None",
    "bool",
    "float",
    "date",
];
const collections: string[] = ["list", "set", "tuple", "dict"];

const primitives: string[] = ["int", "str", "None", "bool", "float", "date"];

// Constants employed to establish presets for styles.
const HIGHLIGHT_TEXT: CSS.PropertiesHyphen = {
    "font-weight": "bolder",
    "font-size": "22px",
};
const FADE_TEXT: CSS.PropertiesHyphen = {
    /*'font-weight': "normal",*/ "fill-opacity": 0.4,
};
const HIDE_TEXT: CSS.PropertiesHyphen = { "fill-opacity": 0 };
const HIGHLIGHT_BOX_LINES: Options = { roughness: 0.2, strokeWidth: 4 };
const HIGHLIGHT_BOX: Options = {
    roughness: 0.2,
    strokeWidth: 4,
    fill: "yellow",
    fillStyle: "solid",
};
const FADE_BOX_LINES: Options = { roughness: 2.0, strokeWidth: 0.5 };
const FADE_BOX: Options = {
    roughness: 2.0,
    strokeWidth: 0.5,
    fill: "rgb(247, 247, 247)",
    fillStyle: "solid",
};
const HIDE_BOX: Options = { fill: "white", fillStyle: "solid" };

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

/**
 * Add CSS to the svg element of a MemoryModel object via style tags.
 * @param {MemoryModel} memory_model - The MemoryModel object that will have CSS set for its associated svg.
 */
function setStyleSheet(memory_model: MemoryModel, global_style: string) {
    const styles = `
        text {
            font-family: Consolas, Courier;
            font-size: ${config.font_size}px;
        }
        text.default {
            fill: ${config.text_color};
            text-anchor: middle;
        }
        text.attribute {
            fill: ${config.value_color};
            text-anchor: start;
        }
        text.variable {
            fill: ${config.text_color};
            text-anchor: start;
        }
        text.id { 
            fill: ${config.id_color};
            text-anchor: middle;
        }
        text.type {
            fill: ${config.value_color};
            text-anchor: middle;
        }
        text.value {
            fill: ${config.value_color};
            text-anchor: middle;
        }
        path {
            stroke: ${config.rect_style?.stroke ?? "rgb(0,0,0)"};
        }
    `;

    const styleSheet = memory_model.document.createElement("style");
    styleSheet.textContent = styles + "\n" + global_style;
    memory_model.svg.appendChild(styleSheet);
}

export { immutable, collections, primitives, presets, setStyleSheet };
