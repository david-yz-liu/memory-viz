/**
 * This file is created to better illustrate the difference between the provided custom style and user-defined styles.
 * All the objects being drawn are the same as ~/docs/examples/style_demo/style_demo.js .The only difference is thatthere
 * are no customized styles for the objects in this file.
 *
 * OUTPUT FILES:
 *      - ~/docs/examples/style_demo/nostyle_demo.svg
 */

const { draw } = require("../../dist/memory_models_rough.node.js");

const configuration = {width: 1300, padding: 30, top_margin: 30, bottom_margin: 40,
    left_margin: 20, right_margin:30, sort_by: "id"
};

const objs = [
    {isClass: true, x: 25, y:200, name: "__main__", id: 82, value: {lst1: 82, lst2: 84, p: 99, d: 10, t: 11},stack_frame: true},
    {isClass: false, x: 350, y: 350, name: "list", id: 54, value: [19, 43, 28, 49]},
    {isClass: false, x: 350, y: 600, name: "list", id: 84, value: [32, 10, 90, 57], show_indexes: true},
    {isClass: false, x: 750, y: 10, name: "int", id: 19, value: 1969},
    {isClass: false, x: 750, y: 250, name: "bool", id: 32, value: true}, // as per the implementation of drawPrimitive
    {isClass: false, x: 750, y: 500, name: "str", id: 43, value: "David is cool"},
    {isClass: false, x: 1050, y: 40, name: "tuple", id: 11, value: [82, 76]},
    {isClass: false, x: 1050, y: 260, name: "set", id: 90, value: [36, 49, 64]},
    {isClass: false, x: 1050, y: 500, name: "dict", id: 10, value: {x: 81, y: 100, z: 121}},
    {isClass: false, x: 750, y: 750, name: "None", id: 13, value: "None"}
]

const m = draw(
    objs,
    true,
    configuration
)

m.save("nostyle_demo.svg")
