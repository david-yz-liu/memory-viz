import { Config, Options } from "roughjs/bin/core.js";
import type * as CSS from "csstype";
import { z } from "zod";

export interface Style {
    text_id?: CSS.PropertiesHyphen;
    text_type?: CSS.PropertiesHyphen;
    text_value?: CSS.PropertiesHyphen;
    box_id?: Options;
    box_type?: Options;
    box_container?: Options;
    text_compound?: {
        [index: number]:
            | CSS.PropertiesHyphen
            | { key?: CSS.PropertiesHyphen; value?: CSS.PropertiesHyphen };
    };
    box_compound?: {
        [index: number]: Options | { key?: Options; value?: Options };
    };
}

export type Styles = Style | (string | Style)[] | string;

export const ObjectId = z.int().nullable().optional();

export const BaseDrawnEntitySchema = z
    .object({
        id: z.union([ObjectId], '"id" field must be an integer or null'),
        x: z.number('"x" field must be a number').optional(),
        y: z.number('"y" field must be a number').optional(),
        style: z
            .custom<Styles>((val) => {
                if (Array.isArray(val)) {
                    return val.every(
                        (item) =>
                            typeof item === "string" ||
                            (typeof item === "object" && item !== null)
                    );
                }
                return (
                    (typeof val === "object" || typeof val === "string") &&
                    val !== null
                );
            }, '"style" field must be a Style object, a bare string, or an array of strings or Style')
            .optional(),
        height: z.number('"height" field must be a number').optional(),
        width: z.number('"width" field must be a number').optional(),
    })
    .strict();

export const IntDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.literal("int"),
    value: z.int('"value" field must be an integer').nullable().optional(),
});

export const FloatDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.literal("float"),
    value: z.number('"value" field must be a number').nullable().optional(),
});

export const BooleanDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.literal("bool"),
    value: z.boolean('"value" field must be a boolean').nullable().optional(),
});

export const StringDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.union([
        z.literal("str"),
        z.literal("complex"),
        z.literal("bytes"),
        z.literal("range"),
        z.literal("date"),
        z.literal("None"),
        z.literal("NoneType"),
    ]),
    value: z.string('"value" field must be a string').nullable().optional(),
});

export const SequenceDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.union([z.literal("list"), z.literal("tuple")]),
    value: z
        .array(ObjectId, '"value" field must be an array of integers or null')
        .optional(),
    show_indexes: z
        .boolean('"show_indexes" field must be a boolean')
        .optional(),
});

export const SetDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.union([z.literal("set"), z.literal("frozenset")]),
    value: z
        .array(ObjectId, '"value" field must be an array of integers or null')
        .optional(),
});

export const DictDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.literal("dict"),
    value: z
        .union(
            [
                z.record(z.string(), ObjectId),
                z.array(z.array(z.union([z.string(), ObjectId]))),
            ],
            '"value" field must be a dict of string keys and integer or null values, or an array with pairs of string, integer, or null values'
        )
        .optional(),
});

export const ClassDrawnEntitySchema = BaseDrawnEntitySchema.extend({
    type: z.literal(".class"),
    name: z.string('"name" field must be a string').optional(),
    value: z
        .record(
            z.string(),
            ObjectId,
            '"value" field must be a dict with integer or null values'
        )
        .optional(),
});

export const FrameDrawnEntitySchema = BaseDrawnEntitySchema.omit({
    id: true,
}).extend({
    type: z.literal(".frame"),
    name: z.string('"name" field must be a string').optional(),
    value: z
        .record(
            z.string(),
            ObjectId,
            '"value" field must be a dict with integer or null values'
        )
        .optional(),
});

export const BlankDrawnEntitySchema = z
    .object({
        type: z.union([z.literal(".blank"), z.literal(".blank-frame")]),
        height: z.number('"height" field must be a number').optional(),
        width: z.number('"width" field must be a number').optional(),
    })
    .strict();

export const DrawnEntitySchema = z.discriminatedUnion("type", [
    IntDrawnEntitySchema,
    FloatDrawnEntitySchema,
    BooleanDrawnEntitySchema,
    StringDrawnEntitySchema,
    SequenceDrawnEntitySchema,
    SetDrawnEntitySchema,
    DictDrawnEntitySchema,
    ClassDrawnEntitySchema,
    FrameDrawnEntitySchema,
    BlankDrawnEntitySchema,
]);

export type DrawnEntity = z.infer<typeof DrawnEntitySchema> &
    z.infer<typeof BaseDrawnEntitySchema> & {
        value?: any;
        name?: any;
        show_indexes?: any;
    };

export type DrawnEntityWithDimensions = Omit<
    DrawnEntity,
    "width" | "height"
> & {
    width: number;
    height: number;
};

export type DrawnEntityStrict = Omit<
    DrawnEntity,
    "width" | "height" | "x" | "y"
> & {
    width: number;
    height: number;
    x: number;
    y: number;
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
    canvas_padding_bottom: number;
    double_rect_sep: number;
    list_index_sep: number;
    font_size: number;
    browser: boolean;
    global_style: string;
    theme: string;
    roughjs_config: Config;
    interactive: boolean;
    sort_by: SortOptions;
    padding: number;
    top_margin: number;
    left_margin: number;
    bottom_margin: number;
    right_margin: number;
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
