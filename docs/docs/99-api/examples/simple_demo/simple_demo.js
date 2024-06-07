/**
 * This file is a simple demonstration of the framework.
 *
 * OUTPUT FILES: ~/examples/simple_demo/simple_demo.svg
 *

 */
const { draw } = require("memory-viz");

const objects = [
    {
        type: ".frame",
        name: "__main__",
        id: null,
        value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
    },
    {
        type: "str",
        id: 19,
        value: "David is cool!",
        style: ["highlight"],
    },
    { type: "int", id: 13, value: 7 },
];

const m = draw(objects, true, { width: 1300 });

m.save("simple_demo.svg");
