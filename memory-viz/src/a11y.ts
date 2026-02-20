import { DrawnEntity, DrawnEntityStrict } from "./types.js";
import i18n from "./i18n.js";

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
 * Returns a descriptive title for a DrawnEntity object.
 *
 * @param object - the DrawnEntity object to be drawn.
 */
function getGroupTitle(object: DrawnEntity): string {
    if (object.type === ".frame") {
        const name = object.name
            ? object.name
            : i18n.t("unnamedObjects.unnamedFunction");
        return i18n.t("groupTitles.stackFrame", { name });
    } else if (object.type === ".class") {
        const name = object.name
            ? object.name
            : i18n.t("unnamedObjects.unnamedClass");
        const count =
            object.value && typeof object.value === "object"
                ? Object.keys(object.value).length
                : 0;
        return i18n.t("groupTitles.class", { name, count });
    }

    const id_label =
        object.id === undefined || object.id === null ? "" : `id${object.id}`;

    const sequence_set_types = ["list", "tuple", "set", "frozenset"];
    if (sequence_set_types.includes(object.type!)) {
        const count = Array.isArray(object.value) ? object.value.length : 0;
        const object_type =
            object.type!.charAt(0).toUpperCase() + object.type!.slice(1);
        return i18n.t("groupTitles.sequence", { object_type, id_label, count });
    } else if (object.type === "dict") {
        let count = 0;
        if (Array.isArray(object.value)) {
            count = object.value.length;
        } else if (object.value && typeof object.value === "object") {
            count = Object.keys(object.value).length;
        }
        return i18n.t("groupTitles.dict", { id_label, count });
    }

    const object_type =
        object.type!.charAt(0).toUpperCase() + object.type!.slice(1);
    let value: string;
    if (object.value === null || object.value === undefined) {
        value = i18n.t("blanks.blankValue");
    } else if (object.type === "str") {
        value = `"${object.value}"`;
    } else {
        value = String(object.value);
    }
    return i18n.t("groupTitles.primitive", {
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
function getGroupDescription(object: DrawnEntity): string | null {
    const sequence_set_types = ["list", "tuple", "set", "frozenset"];
    if (object.type === ".class") {
        const attributes = Object.keys(object.value)
            .map((k) => (k.trim() === "" ? i18n.t("blanks.blankAttribute") : k))
            .join(", ");
        return attributes
            ? i18n.t("groupDescriptions.class", { attributes })
            : null;
    } else if (sequence_set_types.includes(object.type!)) {
        const elements = Array.isArray(object.value)
            ? object.value
                  .map((v) =>
                      v !== undefined && v !== null
                          ? `id${v}`
                          : i18n.t("blanks.blankValue")
                  )
                  .join(", ")
            : "";
        return elements
            ? i18n.t("groupDescriptions.sequence", { elements })
            : null;
    } else if (object.type === "dict") {
        let entries = "";
        if (Array.isArray(object.value)) {
            entries = object.value
                .map((e) => {
                    const key =
                        e &&
                        e[0] !== undefined &&
                        e[0] !== null &&
                        String(e[0]).trim() !== ""
                            ? `id${e[0]}`
                            : i18n.t("blanks.blankKey");
                    const string =
                        e && e[1] !== undefined && e[1] !== null
                            ? `id${e[1]}`
                            : i18n.t("blanks.blankValue");
                    return `${key}: ${string}`;
                })
                .join(", ");
        } else if (object.value && typeof object.value === "object") {
            entries = Object.entries(object.value)
                .map(([k, v]) => {
                    const key =
                        k !== undefined && k !== null && String(k).trim() !== ""
                            ? `id${k}`
                            : i18n.t("blanks.blankKey");
                    const string =
                        v !== undefined && v !== null
                            ? `id${v}`
                            : i18n.t("blanks.blankValue");
                    return `${key}: ${string}`;
                })
                .join(", ");
        }
        return entries ? i18n.t("groupDescriptions.dict", { entries }) : null;
    }
    return null;
}

export { getMemoryModelTitle, getGroupTitle, getGroupDescription };
