/**
 * This file demonstrates the use of the 'drawAutomated' function from the 'automate.js' module (so both the stackframes
 * and the object space is present). This function accepts a list of objects, the desired canvas width, and a
 * 'configuration' object meant to define specs like margins and padding.
 *
 * The actual list of objects is stored as JSON file (automated_json.json) and it is being parsed here to become an
 * actual JS array of objects.
 *
 * OUTPUT FILES:
 *      - ~/docs/images/demo_4.svg"
 */

const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems, MemoryModel } =
    require("../dist/memory_models_rough.node.js");

objs = [
    {"isClass": true, "name": "__main__", "id": null, "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11}, "stack_frame": true,
    'style': {'text': {id: {'font-size': 'x-large'}, value: {}, type: {"font-weight" : "bold"}}, 'box':{}}},
    {"isClass": true, "name": "func", "id": null, "value": {"age": 12, "name": 17}, "stack_frame": true},
    {"isClass": false, "name": "list", "id": 82, "value": [19, 43, 28, 49],
        style: {text: {
                id: {}, type: {},
                value:{"font-weight" : "bold"}}, box: {}}},
    {"isClass": false, "name": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true},
    {"isClass": false, "name": "int", "id": 19, "value": 1969,
        style : {text : {id: {}, value: {"font-size" : "xxx-large"}, type: {}}, box: {}}},
    {"isClass": false, "name": "bool", "id": 32, "value": true,
    style : {text : {id: {}, value: {"font-style" : "italic"}, type: {}}, box: {}}},
    {"isClass": false, "name": "str", "id": 43, "value": "David is cool",
        style : {text : {id: {}, value: {"font-style" : "italic"}, type: {}}, box: {}}},
    {"isClass": false, "name": "tuple", "id": 11, "value": [82, 76],
        style : {
            text : {id: {}, value: {}, type: {}},
            box: {
                type: {"fill" : "black", fillStyle: "solid"},
                id: {fill : "orange"}
            }}},
    {"isClass": false, "name": "set", "id": 90, "value": [36, 49, 64]},
    {"isClass": false, "name": "dict", "id": 10, "value": {"x": 81, "y": 100, "z": 121}},
    {"isClass": false, "name": "None", "id": 13, "value": "None",
    style: {text: {id: {}, type: {}, value: {}},
        box: {container :
                {'fillStyle': 'zigzag', "fill" : "red"},
            type: {'fillStyle': 'dots', "fill" : "blue"},
            id: {}
    }
    }
    }

]


// xx-small, x-small, small, medium, large, x-large, xx-large, xxx-large

const WIDTH = 1300;

const m = drawAutomated(
    objects = objs,
    width = WIDTH,
    configuration = {padding: 60, top_margin: 50, bottom_margin: 50, left_margin: 80, right_margin:80}
)

// Saving to SVG file
m.save("../docs/images/demo_6.svg")
