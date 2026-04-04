import { DrawnEntity, DrawnEntityStrict } from "./types.js";
import i18n from "./i18n.js";

const TEXT_DESCRIPTION = {
    value: "Value",
    id: "Object id",
    type: "Object type",
    function_name: "Function name",
    attribute_name: "Attribute name",
    attribute_value: "Attribute value",
    parameter_name: "Parameter name",
    parameter_value: "Parameter value",
    index: "Index",
    element: "Element",
    dict_key: "Dictionary key",
    dict_value: "Dictionary value",
};

/**
 * Returns a descriptive title for a MemoryModel diagram.
 *
 * @param strict_objects - a list of DrawnEntityStrict objects to be drawn.
 */
function getMemoryModelTitle(strict_objects: DrawnEntityStrict[]): string {
    const has_stack_frames = strict_objects.some((o) => o.type === ".frame");
    const has_objects = strict_objects.some(
        (o) =>
            o.type !== ".frame" &&
            o.type !== ".blank" &&
            o.type !== ".blank-frame"
    );

    if (has_stack_frames && has_objects) {
        return i18n.t("memoryModelTitles.stackFramesAndObjects");
    } else if (has_stack_frames) {
        return i18n.t("memoryModelTitles.stackFramesOnly");
    } else if (has_objects) {
        return i18n.t("memoryModelTitles.objectsOnly");
    } else {
        return i18n.t("memoryModelTitles.blank");
    }
}

/**
 * Returns a descriptive title for a group of stack frames or objects.
 * If the object contains no objects or contains only blanks, return null.
 *
 * @param strict_objects - a list of DrawnEntityStrict objects to be drawn.
 * @param type - the type of entities contained within the group (frame or object)
 */
function getGroupTitle(
    strict_objects: DrawnEntityStrict[],
    type: string
): string | null {
    const count = strict_objects.filter(
        (o) => o.type !== ".blank" && o.type !== ".blank-frame"
    ).length;
    if (count === 0) {
        return null;
    } else if (type === "frame") {
        return i18n.t("groupTitles.stackFrameGroup", { count });
    } else {
        return i18n.t("groupTitles.objectGroup", { count });
    }
}

/**
 * Returns a descriptive title for a DrawnEntity object.
 *
 * @param object - the DrawnEntity object to be drawn.
 */
function getObjectTitle(object: DrawnEntity): string {
    if (object.type === ".frame") {
        const name = object.name
            ? object.name
            : i18n.t("unnamedObjects.unnamedFunction");
        return i18n.t("objectTitles.stackFrame", { name });
    } else if (object.type === ".class") {
        const name = object.name
            ? object.name
            : i18n.t("unnamedObjects.unnamedClass");
        const count = Object.keys(object.value).length;
        return i18n.t("objectTitles.class", { name, count });
    }

    const id_label = object.id === null ? "" : `id${object.id}`;

    if (
        object.type === "list" ||
        object.type === "tuple" ||
        object.type === "set" ||
        object.type === "frozenset"
    ) {
        const count = object.value.length;
        const object_type =
            object.type!.charAt(0).toUpperCase() + object.type!.slice(1);
        return i18n.t("objectTitles.sequence", {
            object_type,
            id_label,
            count,
        });
    } else if (object.type === "dict") {
        let count = 0;
        if (Array.isArray(object.value)) {
            count = object.value.length;
        } else {
            count = Object.keys(object.value).length;
        }
        return i18n.t("objectTitles.dict", { id_label, count });
    }

    const object_type =
        object.type!.charAt(0).toUpperCase() + object.type!.slice(1);
    let value: string;
    if (object.value === null) {
        value = i18n.t("blanks.blankValue");
    } else if (object.type === "str") {
        value = `"${object.value}"`;
    } else {
        value = String(object.value);
    }
    return i18n.t("objectTitles.primitive", {
        object_type,
        id_label,
        value,
    });
}

/**
 * Returns a description for a container DrawnEntity object.
 * If the object does not need a description, return null.
 *
 * @param object - the DrawnEntity object to be drawn.
 */
function getObjectDescription(object: DrawnEntity): string | null {
    if (object.type === ".class") {
        const attributes = Object.keys(object.value)
            .map((k) => (k.trim() === "" ? i18n.t("blanks.blankAttribute") : k))
            .join(", ");
        return attributes
            ? i18n.t("objectDescriptions.class", { attributes })
            : null;
    } else if (
        object.type === "list" ||
        object.type === "tuple" ||
        object.type === "set" ||
        object.type === "frozenset"
    ) {
        const elements = object.value
            .map((v) => (v !== null ? `id${v}` : i18n.t("blanks.blankValue")))
            .join(", ");
        return elements
            ? i18n.t("objectDescriptions.sequence", { elements })
            : null;
    } else if (object.type === "dict") {
        let entries = "";
        if (Array.isArray(object.value)) {
            entries = object.value
                .map((e) => {
                    const key =
                        e[0] !== null && String(e[0]).trim() !== ""
                            ? `id${e[0]}`
                            : i18n.t("blanks.blankKey");
                    const string =
                        e[1] !== null
                            ? `id${e[1]}`
                            : i18n.t("blanks.blankValue");
                    return `${key}: ${string}`;
                })
                .join(", ");
        } else {
            entries = Object.entries(object.value)
                .map(([k, v]) => {
                    const key =
                        String(k).trim() !== ""
                            ? `id${k}`
                            : i18n.t("blanks.blankKey");
                    const string =
                        v !== null ? `id${v}` : i18n.t("blanks.blankValue");
                    return `${key}: ${string}`;
                })
                .join(", ");
        }
        return entries ? i18n.t("objectDescriptions.dict", { entries }) : null;
    }
    return null;
}

export {
    TEXT_DESCRIPTION,
    getMemoryModelTitle,
    getGroupTitle,
    getObjectTitle,
    getObjectDescription,
};
