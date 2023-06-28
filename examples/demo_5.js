/**
 * This file demonstrates the use of the 'draw' function from the 'user_interface.js' module.
 * This is the result of all the automation work, and is the only function the user will ever have to call.
 * Check the function's docstring for usage information.
 *
 * This file demonstrates both reading the objects array from a JSON and actually creating it as a JS array.
 *
 * OUTPUT FILES:
 *      - ~/docs/images/demo_5A.svg"            (demo of passing JS array)
 *      - ~/docs/images/demo_5A.svg"            (demo of passing JSON file)
 */
const { draw } = require("../dist/memory_models_rough.node.js");
const fs = require("fs");

const WIDTH = 1300;

const json_string = fs.readFileSync("../docs/automated_json.json", "utf-8");
const objs = JSON.parse(json_string);

const configuration = {width: 1300, padding: 30, top_margin: 30, bottom_margin: 40, left_margin: 20, right_margin:30};

// Demonstrating with a Javascript array of objects
const m1 = draw(
    objs,
    true,
    configuration
)

m1.save("../docs/images/demo_5A.svg")


// Demonstrating with a JSON file instead of an actual JS array of objects
const m2 = draw(
    "../docs/automated_json.json",
    true,
    configuration
)

m2.save("../docs/images/demo_5B.svg")