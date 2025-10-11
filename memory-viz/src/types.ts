import { Config, Options } from "roughjs/bin/core";
import type * as CSS from "csstype";
import { z } from "zod";

export interface Style {
    text_id?: CSS.PropertiesHyphen;
    text_type?: CSS.PropertiesHyphen;
    text_value?: CSS.PropertiesHyphen;
    box_id?: Options;
    box_type?: Options;
    box_container?: Options;
}

export type Styles = Style | (string | Style)[];

export const DrawnEntitySchema = z.object({
    name: z.string('"name" field must be a string').optional(),
    type: z.string('"type" field must be a string').optional(),
    x: z.number('"x" field must be a number').optional(),
    y: z.number('"y" field must be a number').optional(),
    id: z
        .union([z.number(), z.null()], '"id" field must be a number or null')
        .optional(),
    value: z.any().optional(),
    show_indexes: z
        .boolean('"show_indexes" field must be a boolean')
        .optional(),
    style: z
        .custom<Styles>((val) => {
            if (Array.isArray(val)) {
                return val.every(
                    (item) =>
                        typeof item === "string" ||
                        (typeof item === "object" && item !== null)
                );
            }
            return typeof val === "object" && val !== null;
        }, '"style" field must be a Style object or an array of strings or Style')
        .optional(),
    height: z.number('"height" field must be a number').optional(),
    width: z.number('"width" field must be a number').optional(),
    rowBreaker: z.boolean('"rowBreaker" field must be a boolean').optional(),
});

export type DrawnEntity = z.infer<typeof DrawnEntitySchema>;

export type DrawnEntityStrict = Omit<DrawnEntity, "width" | "height"> & {
    width: number;
    height: number;
};

export interface DisplaySettings {
    width: number;
    height: number;
    sort_by: SortOptions;
    style: Styles;
    roughjs_config: Config;
    global_style: string;
    theme: string;
    padding: number;
    top_margin: number;
    left_margin: number;
    bottom_margin: number;
    right_margin: number;
    interactive: boolean;
}

export interface VisualizationConfig {
    width: number;
    height: number;
    rect_style: {
        stroke: string;
    };
    text_color: string;
    value_color: string;
    id_color: string;
    item_min_width: number;
    item_min_height: number;
    obj_min_width: number;
    obj_min_height: number;
    prop_min_width: number;
    prop_min_height: number;
    obj_x_padding: number;
    canvas_padding: number;
    double_rect_sep: number;
    list_index_sep: number;
    font_size: number;
    browser: boolean;
    global_style: string;
    theme: string;
    roughjs_config: Config;
    interactive: boolean;
}

export interface Size {
    width: number;
    height: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface Rect extends Point, Size {}

export enum SortOptions {
    Height,
    Id,
}

export type Primitive =
    | string
    | number
    | boolean
    | null
    | undefined
    | bigint
    | symbol;
