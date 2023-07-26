/**
 * This file demonstrates the ability to leave "blanks" when the 'automated' option is on.
 *
 * To define a blank box, you specify it as an object in the list with three attributes:
 * - name: This must be equal to "BLANK"
 * - width: the desired width of the blank box (I say box but in reality there aren't any borders)
 * - height: the desired height of the blank box
 *
 * NOTE:
 *   At the minimum, only the name attribute is required (must be assigned to "BLANK" so the algorithms knows what
 *   you want to do). If do not specify a width or a height, the default width of 300 and default height of 200 will
 *   be assigned to the 'blank' object. Including more attributes will not lead to an error, but will not achieve
 *   anything either.
 *
 * OUTPUT FILES:
 *      - ~/docs/images/demo_7.svg"
 */

const {MemoryModel, drawAutomatedOtherItems} = require("../dist/memory_models_rough.node.js");

const fs = require("fs");

const WIDTH = 1300;

const listOfObjs = [
    {"isClass": true, "name": "__main__", "id": null, "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11}, "stack_frame": true},
    {"name": "BLANK", "width": 100, "height": 200, "stack_frame" : true},
    {"isClass": true, "name": "func", "id": null, "value": {"age": 12, "name": 17}, "stack_frame": true},
    {"isClass": false, "name": "list", "id": 82, "value": [19, 43, 28, 49]},
    {"isClass": false, "name": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true},
    {"isClass": false, "name": "int", "id": 19, "value": 1969},
    {"name": "BLANK", "width": 100, "height": 200, "stack_frame" : true},
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

console.log("HERE WE ARE 2!")
const m = new MemoryModel({width: canvas_width, height: canvas_height});

console.log(objs, canvas_height)
m.drawAll(objs)
m.save("../docs/images/demo_7.svg")


// // JSON
// const stringified_objs = JSON.stringify(objs)
// fs.writeFileSync("../docs/automated_model.json", stringified_objs)
// const m2 = new MemoryModel({width: WIDTH, height: canvas_height});
// m2.createFromJSON("../docs/automated_model.json");
// m2.save("../docs/images/demo_3B.svg")

