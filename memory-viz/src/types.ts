export interface DrawnEntity {
    name?: string;
    type?: string;
    x?: number;
    y?: number;
    id: number | string;
    value: any;
    show_indexes?: boolean;
    style?: Style;
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
