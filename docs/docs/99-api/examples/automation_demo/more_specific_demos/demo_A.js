/**
 * This file demonstrates the use of the 'drawAutomatedOtherItems' function from the 'automate.js' module. This function
 * is used as a helper function for the "container" 'drawAutomated' function.
 *
 * OUTPUT FILES:
 *      - ~/examples/automation_demo/more_specific_demos/other_objects.svg"
 */

import { MemoryModel, drawAutomatedOtherItems } from "memory-viz";

const WIDTH = 1300;

const listOfObjs = [
    {
        type: ".frame",
        name: "Person",
        id: 99,
        value: { age: 12, name: 17 },
    },
    { type: "list", id: 82, value: [19, 43, 28, 49] },
    { type: "int", id: 19, value: 1969 },
];

const { objs, canvas_height, canvas_width } = drawAutomatedOtherItems(
    listOfObjs,
    WIDTH,
    "height",
    {},
    150 // This is the "separator", dividing the stack-frame space from the object space.
);

const m = new MemoryModel({ width: canvas_width, height: canvas_height });

m.drawAll(objs);
m.save("other_objects.svg");
