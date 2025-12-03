import { Style } from "./types.js";

export function isArrayOfType<T>(value: any, type: string): value is T[] {
    return (
        Array.isArray(value) &&
        value.every((element) => typeof element === type)
    );
}

export function isArrayOfNullableType<T>(
    value: any,
    type: string
): value is (T | null)[] {
    return (
        Array.isArray(value) &&
        value.every((element) => typeof element === type || element === null)
    );
}

export function isStyle(value: any): value is Style {
    const attributes = [
        "text_id",
        "text_type",
        "text_value",
        "box_id",
        "box_type",
        "box_container",
    ];
    const roughjs_options = [
        "maxRandomnessOffset",
        "roughness",
        "bowing",
        "stroke",
        "strokeWidth",
        "curveFitting",
        "curveTightness",
        "curveStepCount",
        "fill",
        "fillStyle",
        "fillWeight",
        "hachureAngle",
        "hachureGap",
        "simplification",
        "dashOffset",
        "dashGap",
        "zigzagOffset",
        "seed",
        "strokeLineDash",
        "strokeLineDashOffset",
        "fillLineDash",
        "fillLineDashOffset",
        "disableMultiStroke",
        "disableMultiStrokeFill",
        "preserveVertices",
        "fixedDecimalPlaceDigits",
        "fillShapeRoughnessGain",
    ];
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (attributes.some((key) => key in value) ||
            roughjs_options.some((key) => key in value) ||
            Object.keys(value).length === 0)
    );
}
