import { Style } from "./types";

// TODO: if there are packages that can already do this
export function isArrayOfType<T>(value: any, type: string): value is T[] {
    return (
        Array.isArray(value) &&
        value.every((element) => typeof element === type)
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
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        attributes.some((key) => key in value)
    );
}
