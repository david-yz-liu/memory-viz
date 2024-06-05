interface DrawnObject {
    isClass: boolean;
    name?: string;
    type?: string;
    x?: number;
    y?: number;
    id: number | string;
    value: any;
    stack_frame: boolean;
    show_indexes?: boolean;
    style?: Style;
}

interface AttributeStyle {
    [propName: string]: string | number;
}

interface Style {
    text_id?: AttributeStyle;
    text_type?: AttributeStyle;
    text_value?: AttributeStyle;
    box_id?: AttributeStyle;
    box_type?: AttributeStyle;
    box_container?: AttributeStyle;
}
