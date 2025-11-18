/**
 * This file is created to better illustrate the difference between the provided custom style and user-defined styles.
 * All the objects being drawn are the same as ~/docs/examples/style_demo/style_demo.js .The only difference is thatthere
 * are no customized styles for the objects in this file.
 *
 * OUTPUT FILES:
 *      - ~/docs/examples/style_demo/nostyle_demo.svg
 */

import { draw } from "memory-viz";

const configuration = {
    width: 1300,
    padding: 30,
    top_margin: 30,
    bottom_margin: 40,
    left_margin: 20,
    right_margin: 30,
    sort_by: "id",
};

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
        x: 350,
        y: 350,
        type: "list",
        id: 54,
        value: [19, 43, 28, 49],
    },
    {
        x: 750,
        y: 500,
        type: "str",
        id: 43,
        value: "David is cool",
    },
    {
        x: 1050,
        y: 260,
        type: "set",
        id: 90,
        value: [36, 49, 64],
    },
    {
        x: 1050,
        y: 500,
        type: "dict",
        id: 10,
        value: { x: 81, y: 100, z: 121 },
    },
    { x: 750, y: 750, type: "None", id: 13, value: "None" },
];

const m = draw(objs, true, configuration);

m.save("nostyle_demo.svg");
