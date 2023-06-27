// const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems, vert_beautify} = require("../dist/automate.js");
// const { MemoryModel } = require("../dist/index.js");

const {MemoryModel, config, drawAutomated, drawAutomatedOtherItems} = require("../dist/memory_models_rough.node.js");
console.log(MemoryModel)
const fs = require("fs");

const WIDTH = 1300;

const {objs, canvas_height, canvas_width} = drawAutomatedOtherItems(
    [
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
    ],
    WIDTH,
    sort_by="height",
    config_aut={padding: 15, right_margin: 20, bottom_margin: 20}
)

console.log("8273490832714-93723489729472372387289203879-2374-32874987230-482-48")
console.log(objs)
console.log(canvas_height)

// const m = new MemoryModel({width: WIDTH, height: canvas_height});
console.log(canvas_width)
const m = new MemoryModel({width: canvas_width, height: canvas_height});

console.log(objs, canvas_height)
m.drawAll(objs)
m.save("../docs/images/demo_3.svg")


const stringified_objs = JSON.stringify(objs)

fs.writeFileSync("../docs/automated_model.json", stringified_objs)

const m2 = new MemoryModel({width: WIDTH, height: canvas_height});
m2.createFromJSON("../docs/automated_model.json");
m2.save("../docs/images/demo_3B.svg")


// const data = [
//         {"isClass": true, "name": "__main__", "id": 82, "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11}, "stack_frame": true},
//         {"isClass": true, "name": "Person", "id": 99, "value": {"age": 12, "name": 17}, "stack_frame": false},
//         {"isClass": false, "name": "list", "id": 82, "value": [19, 43, 28, 49]},
//         {"isClass": false, "name": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true},
//         {"isClass": false, "name": "int", "id": 19, "value": 1969},
//         {"isClass": false, "name": "bool", "id": 32, "value": true},
//         {"isClass": false, "name": "str", "id": 43, "value": "David is cool"},
//         {"isClass": false, "name": "tuple", "id": 11, "value": [82, 76]},
//         {"isClass": false, "name": "set", "id": 90, "value": [36, 49, 64]},
//         {"isClass": false, "name": "dict", "id": 10, "value": {"x": 81, "y": 100, "z": 121}},
//         {"isClass": false, "name": "None", "id": 13, "value": "None"}
//
// ]
//
// vert_beautify(data);
// const stringified_objs_2 = JSON.stringify(data);
// fs.writeFileSync("../docs/beautified_model.json", stringified_objs_2)





const m_beaut = new MemoryModel({width: WIDTH, height: canvas_height});
m_beaut.drawAll(vert_beautify(objs))
m_beaut.save("../docs/images/demo_3_Beaut.svg")



