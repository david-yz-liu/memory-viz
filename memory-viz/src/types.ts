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
    [propName: string]: string | number;
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
    sort_by?: string;
    style?: Style;
    left_margin?: number;
    roughjs_config?: any;
}
