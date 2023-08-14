/**
 * This file demonstrates the capability of coordinate automation.
 * It uses the'draw' function from the 'user_interface.js' module; the only function the user will ever have to call.
 * Check the function's docstring for usage information.
 *
 *
 * OUTPUT FILES:
 *      -

 */
const { draw } = require("../../dist/memory_models_rough.node.js");

const configuration = {width: 1300, padding: 30, top_margin: 30, bottom_margin: 40,
    left_margin: 20, right_margin:30, sort_by: "id"
};

// Demonstrating with a JSON file instead of an actual JS array of objects
const m = draw(
    "../docs/automated_json.json",
    true,
    configuration
)

m.save("automation_demo.svg")
