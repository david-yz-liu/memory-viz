export interface DrawnEntity {
    name?: string;
    type?: string;
    x?: number;
    y?: number;
    id?: number | string | null;
    value?: any;
    show_indexes?: boolean;
    style?: string[] | Style;
    height?: number;
    width?: number;
    rowBreaker?: boolean;
}

export interface AttributeStyle {
    [propName: string]: string | number | AttributeStyle;
}

export interface Style {
    text_id?: AttributeStyle;
    text_type?: AttributeStyle;
    text_value?: AttributeStyle;
    box_id?: AttributeStyle;
    box_type?: AttributeStyle;
    box_container?: AttributeStyle;
}

export type Styles = Style | (string | Style)[];

export interface MemoryVizConfiguration {
    width: number;
    height: number;
    sort_by: SortOptions;
    style: Style;
    roughjs_config: object;
    padding: number;
    top_margin: number;
    left_margin: number;
    bottom_margin: number;
    right_margin: number;
}

export interface MemoryModelOptions {
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
    roughjs_config: object;
}

export enum SortOptions {
    Height,
    Id,
}
