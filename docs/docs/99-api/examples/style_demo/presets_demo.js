/**
 * This file demonstrates the use **presets** for styling text and boxes in a memory model diagram.
 *
 * This is a rough demo for illustrating the capabilities of "highlighting" features.
 *
 * OUTPUT FILE: ~/examples/style_demo/presets_demo.svg"
 */

const { draw } = require("memory-viz");

const WIDTH = 1300;

const objs = [
    {
        type: ".frame",
        x: 25,
        y: 200,
        name: "__main__",
        id: null,
        value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
    },
    {
        type: ".frame",
        x: 350,
        y: 10,
        name: "tuple",
        id: 99,
        value: { age: 12, name: 17 },
        style: ["highlight_type"],
    },
    {
        x: 350,
        y: 350,
        type: "list",
        id: 54,
        value: [19, 43, 28, 49],
        style: ["hide_type"],
    },

    {
        x: 750,
        y: 500,
        type: "str",
        id: 43,
        value: "David is cool",
        style: ["highlight", "hide_type"],
    },

    {
        x: 1050,
        y: 40,
        type: "tuple",
        id: 11,
        value: [82, 76],
        style: ["highlight"],
    },

    {
        x: 1050,
        y: 260,
        type: "set",
        id: 90,
        value: [36, 49, 64],
        style: ["fade"],
    },
];

const configuration = { width: WIDTH };

const m = draw(objs, true, configuration);

m.save("presets_demo.svg");
