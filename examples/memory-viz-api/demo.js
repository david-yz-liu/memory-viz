#!/usr/bin/env node

// Import draw function
const { draw } = require("memory-viz");

// Define the data to visualize
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
    {
        type: "int",
        id: 13,
        value: 7,
    },
];

// Visualize the data, using an automated layout, and with an image width of 1300px
const model = draw(objects, true, { width: 1300 });

// Save the visualization to demo_output.svg
model.save("demo_output.svg");
