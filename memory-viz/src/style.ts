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

const HIGHLIGHT_VALUE_TEXT: CSS.PropertiesHyphen = {
    ...HIGHLIGHT_TEXT,
    fill: "var(--highlight-value-text-color)",
};

const HIGHLIGHT_ID_TEXT: CSS.PropertiesHyphen = {
    ...HIGHLIGHT_TEXT,
    fill: "var(--highlight-id-text-color)",
};

const FADE_TEXT: CSS.PropertiesHyphen = {
    "fill-opacity": 0.4,
    fill: "var(--fade-text-color)",
};

const HIDE_TEXT: CSS.PropertiesHyphen = {
    "fill-opacity": 0,
    fill: "var(--hide-text-color)",
};

const HIGHLIGHT_BOX_LINES: Options = {
    roughness: 0.2,
    strokeWidth: 4,
    stroke: "var(--highlight-box-line-color)",
};

const HIGHLIGHT_BOX: Options = {
    roughness: 0.2,
    strokeWidth: 4,
    fill: "var(--highlight-box-fill)",
    fillStyle: "solid",
    stroke: "var(--highlight-box-line-color)",
};

const FADE_BOX_LINES: Options = {
    roughness: 2.0,
    strokeWidth: 0.5,
    stroke: "var(--fade-box-line-color)",
};

const FADE_BOX: Options = {
    roughness: 2.0,
    strokeWidth: 0.5,
    fill: "var(--fade-box-fill)",
    fillStyle: "solid",
    stroke: "var(--fade-box-line-color)",
};

const HIDE_BOX: Options = {
    fill: "var(--hide-box-fill)",
    fillStyle: "solid",
};

const presets: Record<string, Style> = {
    highlight: {
        text_value: HIGHLIGHT_VALUE_TEXT,
        text_id: HIGHLIGHT_ID_TEXT,
        text_type: HIGHLIGHT_VALUE_TEXT,
        box_id: HIGHLIGHT_BOX_LINES,
        box_type: HIGHLIGHT_BOX_LINES,
        box_container: HIGHLIGHT_BOX,
    },
    highlight_id: {
        text_id: HIGHLIGHT_ID_TEXT,
        box_id: HIGHLIGHT_BOX,
    },
    highlight_type: {
        text_type: HIGHLIGHT_VALUE_TEXT,
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

const DARK_THEME_CSS = `
        [data-theme="dark"] {
            --highlight-value-text-color: #110875;
            --highlight-id-text-color: #6e4409;

            --fade-text-color: #BBBBBB;
            --hide-text-color: #121212;

            --highlight-box-fill: #EDB926;
            --highlight-box-line-color: #FFFFFF;

            --fade-box-fill: #2C2C2C;
            --fade-box-line-color: #666666;

            --hide-box-fill: #121212;

            --highlight-object-fill: rgba(72, 207, 173, 0.3);
        }
        [data-theme="dark"] text.default,
        [data-theme="dark"] text.variable {
            fill: rgb(224, 224, 224);
        }
        [data-theme="dark"] text.attribute,
        [data-theme="dark"] text.type,
        [data-theme="dark"] text.value {
            fill: rgb(144, 164, 237);
        }
        [data-theme="dark"] text.id {
            fill: rgb(255, 183, 77);
        }
        [data-theme="dark"] path {
            stroke: rgb(204, 204, 204);
        }
`;

const HIGH_CONTRAST_THEME_CSS = `
        [data-theme="high-contrast"] {
            --highlight-value-text-color: #FFFFFF;
            --highlight-id-text-color: #FFFF00;

            --fade-text-color: #CCCCCC;
            --hide-text-color: #000000;

            --highlight-box-fill: #0000FF;
            --highlight-box-line-color: #FFFFFF;

            --fade-box-fill: #333333;
            --fade-box-line-color: #FFFFFF;

            --hide-box-fill: #000000;

            --highlight-object-fill: rgba(0, 0, 255, 0.5);
        }
        [data-theme="high-contrast"] text.default,
        [data-theme="high-contrast"] text.variable {
            fill: rgb(255, 255, 255);
        }
        [data-theme="high-contrast"] text.attribute,
        [data-theme="high-contrast"] text.type,
        [data-theme="high-contrast"] text.value {
            fill: rgb(0, 255, 255);
        }
        [data-theme="high-contrast"] text.id {
            fill: rgb(255, 255, 0);
        }
        [data-theme="high-contrast"] path {
            stroke: rgb(255, 255, 255);
        }`;
/**
 * Add CSS to the svg element of a MemoryModel object via style tags.
 * @param {MemoryModel} memory_model - The MemoryModel object that will have CSS set for its associated svg.
 * @param {string} global_style - An optional string containing global CSS styles to be applied to the svg.
 * @param {string} theme - An optional string that overrides the default light theme for the svg.
 */
function setStyleSheet(
    memory_model: MemoryModel,
    global_style?: string,
    theme?: string
) {
    const interactiveCursor = memory_model.interactive ? "pointer" : "auto";

    const styles = `
        :root {
        --fade-text-color: ${config.text_color};
        --hide-text-color: white;

        --highlight-value-text-color: ${config.value_color};
        --highlight-id-text-color: ${config.id_color};

        --highlight-box-fill: yellow;
        --highlight-box-line-color: ${config.rect_style?.stroke ?? "rgb(0,0,0)"};

        --fade-box-fill: rgb(247, 247, 247);
        --fade-box-line-color: gray;

        --hide-box-fill: white;

        --primitive-value-color: ${config.value_color};
        --id-text-color: ${config.id_color};
        --default-font-size: ${config.font_size}px;

        --highlight-object-fill: rgba(255, 255, 0, 0.6);
    }

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
            cursor: ${interactiveCursor};
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
        .highlighted path {
            fill: var(--highlight-object-fill) !important;
        }
    `;

    const PREDEFINED_STYLES: Record<string, string> = {
        dark: DARK_THEME_CSS,
        "high-contrast": HIGH_CONTRAST_THEME_CSS,
    };
    const THEME_CSS = (theme && PREDEFINED_STYLES[theme]) ?? "";

    const styleSheet = memory_model.document.createElement("style");
    styleSheet.textContent =
        styles + (global_style ? "\n" + global_style : "") + THEME_CSS;
    memory_model.svg.appendChild(styleSheet);

    if (theme) {
        memory_model.svg.setAttribute("data-theme", theme);
    } else {
        memory_model.svg.removeAttribute("data-theme");
    }
}

export { immutable, collections, primitives, presets, setStyleSheet };
