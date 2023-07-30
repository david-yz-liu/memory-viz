/**
 * This file demonstrates the use of the 'drawAutomatedOtherItems' function from the 'automate.js' module. This function
 * is used as a helper function for the "container" 'drawAutomated' function.
 *
 * OUTPUT FILES:
 *      - ~/docs/images/demo_3A.svg"
 */

const {MemoryModel, drawAutomatedOtherItems} = require("../dist/memory_models_rough.node.js");

const fs = require("fs");

const WIDTH = 1300;

const listOfObjs = [
        {"isClass": true, "name": "Person", "id": 99, "value": {"age": 12, "name": 17}, "stack_frame": false},
        {"isClass": false, "name": "list", "id": 82, "value": [19, 43, 28, 49]},
        {"isClass": false, "name": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true},
        {"isClass": false, "name": "int", "id": 19, "value": 1969},
        {"isClass": false, "name": "bool", "id": 32, "value": true},
        {"isClass": false, "name": "str", "id": 43, "value": "David is cool"},
        {"isClass": false, "name": "tuple", "id": 11, "value": [82, 76]},
        {"isClass": false, "name": "set", "id": 90, "value": [36, 49, 64]},
        {"isClass": false, "name": "dict", "id": 10, "value": {"x": 81, "y": 100, "z": 121}},
        {"isClass": false, "name": "None", "id": 13, "value": "None"}
]

const {objs, canvas_height, canvas_width} = drawAutomatedOtherItems(
    listOfObjs,
    WIDTH,
    sort_by="height",
    config_aut={padding: 15, right_margin: 20, bottom_margin: 20},
    sf_endpoint = 150
)

const m = new MemoryModel({width: canvas_width, height: canvas_height});

console.log(objs, canvas_height)
m.drawAll(objs)
m.save("../docs/images/demo_3A.svg")

