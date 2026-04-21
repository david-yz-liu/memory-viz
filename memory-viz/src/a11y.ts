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
 * @param strict_entities - a list of DrawnEntityStrict objects to be drawn.
 */
function getMemoryModelTitle(strict_entities: DrawnEntityStrict[]): string {
    const has_stack_frames = strict_entities.some((o) => o.type === ".frame");
    const has_objects = strict_entities.some(
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
 * If the group contains no objects or contains only blanks, return null.
 *
 * @param strict_entities - a list of DrawnEntityStrict objects to be drawn.
 * @param type - the type of entities contained within the group (frame or object)
 */
function getGroupTitle(
    strict_entities: DrawnEntityStrict[],
    type: "frame" | "object"
): string | null {
    const count = strict_entities.filter(
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
 * Returns a descriptive title for a DrawnEntity.
 *
 * @param entity - the DrawnEntity object to be drawn.
 */
function getEntityTitle(entity: DrawnEntity): string {
    if (entity.type === ".frame") {
        const name = entity.name
            ? entity.name
            : i18n.t("unnamedEntities.unnamedFunction");
        return i18n.t("entityTitles.stackFrame", { name });
    } else if (entity.type === ".class") {
        const name = entity.name
            ? entity.name
            : i18n.t("unnamedEntities.unnamedClass");
        const count = Object.keys(entity.value).length;
        return i18n.t("entityTitles.class", { name, count });
    }

    const id_label = entity.id === null ? "" : `id${entity.id}`;

    if (
        entity.type === "list" ||
        entity.type === "tuple" ||
        entity.type === "set" ||
        entity.type === "frozenset"
    ) {
        const count = entity.value.length;
        const object_type =
            entity.type!.charAt(0).toUpperCase() + entity.type!.slice(1);
        return i18n.t("entityTitles.sequence", {
            object_type,
            id_label,
            count,
        });
    } else if (entity.type === "dict") {
        let count = 0;
        if (Array.isArray(entity.value)) {
            count = entity.value.length;
        } else {
            count = Object.keys(entity.value).length;
        }
        return i18n.t("entityTitles.dict", { id_label, count });
    }

    const object_type =
        entity.type!.charAt(0).toUpperCase() + entity.type!.slice(1);
    let value: string;
    if (entity.value === null) {
        value = i18n.t("blanks.blankValue");
    } else if (entity.type === "str") {
        value = `"${entity.value}"`;
    } else {
        value = String(entity.value);
    }
    return i18n.t("entityTitles.primitive", {
        object_type,
        id_label,
        value,
    });
}

/**
 * Returns a description for a container DrawnEntity.
 * If the entity does not need a description, return null.
 *
 * @param entity - the DrawnEntity object to be drawn.
 */
function getEntityDescription(entity: DrawnEntity): string | null {
    if (entity.type === ".class") {
        const attributes = Object.keys(entity.value)
            .map((k) => (k.trim() === "" ? i18n.t("blanks.blankAttribute") : k))
            .join(", ");
        return attributes
            ? i18n.t("entityDescriptions.class", { attributes })
            : null;
    } else if (
        entity.type === "list" ||
        entity.type === "tuple" ||
        entity.type === "set" ||
        entity.type === "frozenset"
    ) {
        const elements = entity.value
            .map((v) => (v !== null ? `id${v}` : i18n.t("blanks.blankValue")))
            .join(", ");
        return elements
            ? i18n.t("entityDescriptions.sequence", { elements })
            : null;
    } else if (entity.type === "dict") {
        let entries = "";
        if (Array.isArray(entity.value)) {
            entries = entity.value
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
            entries = Object.entries(entity.value)
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
        return entries ? i18n.t("entityDescriptions.dict", { entries }) : null;
    }
    return null;
}

export {
    TEXT_DESCRIPTION,
    getMemoryModelTitle,
    getGroupTitle,
    getEntityTitle,
    getEntityDescription,
};
