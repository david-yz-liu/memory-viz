// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const typedocSidebar = {
    items: [
        {
            type: "category",
            label: "Enumerations",
            items: [
                {
                    type: "doc",
                    id: "api/enumerations/SortOptions",
                    label: "SortOptions",
                },
            ],
        },
        {
            type: "category",
            label: "Interfaces",
            items: [
                {
                    type: "doc",
                    id: "api/interfaces/DisplaySettings",
                    label: "DisplaySettings",
                },
                {
                    type: "doc",
                    id: "api/interfaces/DrawnEntity",
                    label: "DrawnEntity",
                },
                { type: "doc", id: "api/interfaces/Point", label: "Point" },
                { type: "doc", id: "api/interfaces/Rect", label: "Rect" },
                { type: "doc", id: "api/interfaces/Size", label: "Size" },
                { type: "doc", id: "api/interfaces/Style", label: "Style" },
                {
                    type: "doc",
                    id: "api/interfaces/VisualizationConfig",
                    label: "VisualizationConfig",
                },
            ],
        },
        {
            type: "category",
            label: "Type Aliases",
            items: [
                {
                    type: "doc",
                    id: "api/type-aliases/Primitive",
                    label: "Primitive",
                },
                { type: "doc", id: "api/type-aliases/Styles", label: "Styles" },
            ],
        },
        {
            type: "category",
            label: "Functions",
            items: [{ type: "doc", id: "api/functions/draw", label: "draw" }],
        },
    ],
};
module.exports = typedocSidebar.items;
