export interface DrawnEntity {
    name?: string;
    type?: string;
    x?: number;
    y?: number;
    id?: number | string;
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

export interface Configuration {
    width?: number;
    height?: number;
    sort_by?: SortOptions;
    style?: Style;
    roughjs_config?: object;
    padding?: number;
    top_margin?: number;
    left_margin?: number;
    bottom_margin?: number;
    right_margin?: number;
}

export enum SortOptions {
    Height,
    Id,
}
