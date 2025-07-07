import { Config, Options } from "roughjs/bin/core";
import type * as CSS from "csstype";

export type Styles = Style | (string | Style)[];

export interface DrawnEntity {
    name?: string;
    type?: string;
    x?: number;
    y?: number;
    id?: number | null;
    value?: any;
    show_indexes?: boolean;
    style?: Styles;
    height?: number;
    width?: number;
    rowBreaker?: boolean;
}

export interface Style {
    text_id?: CSS.PropertiesHyphen;
    text_type?: CSS.PropertiesHyphen;
    text_value?: CSS.PropertiesHyphen;
    box_id?: Options;
    box_type?: Options;
    box_container?: Options;
}

export interface DisplaySettings {
    width: number;
    height: number;
    sort_by: SortOptions;
    style: Styles;
    roughjs_config: Config;
    global_style: string;
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
    double_rect_sep: number;
    list_index_sep: number;
    font_size: number;
    browser: boolean;
    global_style: string;
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
