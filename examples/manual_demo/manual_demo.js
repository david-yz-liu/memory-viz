/**
 * This file demonstrates an example where the coordinates of objects are hardcoded by the user.
 * It uses the'draw' function from the 'user_interface.js' module.
 * The major difference with `automation_demo.js` is that the second argument to the function must be false
 * (as in `automation === false`).
 *
 * OUTPUT FILE: ~/docs/images/manual.svg"
 */
const { draw } = require("../../dist/memory_models_rough.node.js");
const fs = require("fs");

const configuration = {};

// Demonstrating with a Javascript array of objects
const m = draw(
    "manual_demo.json",
    false,
    configuration
)

m.save("../../docs/images/manual_demo.svg")