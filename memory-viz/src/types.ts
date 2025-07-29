import { Config, Options } from "roughjs/bin/core";
import type * as CSS from "csstype";
import { z } from "zod";

export const StyleSchema = z.object({
    text_id: z.custom<CSS.PropertiesHyphen>().optional(),
    text_type: z.custom<CSS.PropertiesHyphen>().optional(),
    text_value: z.custom<CSS.PropertiesHyphen>().optional(),
    box_id: z.custom<Options>().optional(),
    box_type: z.custom<Options>().optional(),
    box_container: z.custom<Options>().optional(),
});

export type Style = z.infer<typeof StyleSchema>;

export const StylesSchema = z.union([
    StyleSchema,
    z.array(z.union([z.string(), StyleSchema])),
]);

export type Styles = z.infer<typeof StylesSchema>;

export const DrawnEntitySchema = z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    id: z.union([z.number(), z.null()]).optional(),
    value: z.any().optional(),
    show_indexes: z.boolean().optional(),
    style: StylesSchema.optional(),
    height: z.number().optional(),
    width: z.number().optional(),
    rowBreaker: z.boolean().optional(),
});

export type DrawnEntity = z.infer<typeof DrawnEntitySchema>;

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
