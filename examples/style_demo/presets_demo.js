/**
 * This file demonstrates the use **presets** for styling text and boxes in a memory model diagram.
 *
 * This is a rough demo for illustrating the capabilities of "highliting" features.
 *
 * OUTPUT FILE: ./presets_demo.svg"
 */

const { draw } = require("../../dist/memory_models_rough.node")

const WIDTH = 1300;

// A sample array of objects to be used as the `objects` argument for the 'draw' function.
const objs = [
    {isClass: true, x: 25, y:200, name: "__main__", id: 82,
        value: {lst1: 82, lst2: 84, p: 99, d: 10, t: 11},
        stack_frame: true},
    {isClass: true, x: 350, y:10, name: "tuple", id: 99, value: {age: 12, name: 17}, stack_frame: false,
        style: ["highlight_type"]},
    {isClass: false, x: 350, y: 350, name: "list", id: 54, value: [19, 43, 28, 49],
        style: ["hide_type"]},
    {isClass: false, x: 350, y: 600, name: "list", id: 84, value: [32, 10, 90, 57], show_indexes: true},

    {isClass: false, x: 750, y: 10, name: "int", id: 19, value: 1969,
        style: ["highlight_id"]},
    {isClass: false, x: 750, y: 250, name: "bool", id: 32, value: true}, // as per the implementation of drawPrimitive

    {isClass: false, x: 750, y: 500, name: "str", id: 43, value: "David is cool",
        style: ["highlight", "hide_type", {"text_id" : {"font-style" : "italic"}}]},

    {isClass: false, x: 1050, y: 40, name: "tuple", id: 11, value: [82, 76], style: ["highlight"]},

    {isClass: false, x: 1050, y: 260, name: "set", id: 90, value: [36, 49, 64], style: ["fade"]},
    {isClass: false, x: 1050, y: 500, name: "dict", id: 10, value: {x: 81, y: 100, z: 121}, style:["hide"]},
    {isClass: false, x: 750, y: 750, name: "None", id: 13, value: "None", style: ["fade_type"]}

]

const configuration = {width: WIDTH}


const m = draw(objs, true, configuration);

m.save("./presets_demo.svg");


