/**
 * This file demonstrates the use of the 'drawAutomatedStackFrames' function from the 'automate.js' module. This function
 * is used as a helper function for the "container" 'drawAutomated' function.
 *
 * OUTPUT FILES:
 *      - ~/examples/automation_demo/more_specific_demos/stack_frames.svg
 */

import { MemoryModel, drawAutomatedStackFrames } from "memory-viz";

const WIDTH = 1300;
const listOfStackFrames = [
    {
        type: ".frame",
        name: "__main__",
        id: null,
        value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
    },
    {
        type: ".frame",
        name: "Animal",
        id: null,
        value: { age: 2, name: 94 },
    },
];

const { StackFrames, requiredHeight } = drawAutomatedStackFrames(
    listOfStackFrames,
    {}
);

const m = new MemoryModel({ width: WIDTH, height: requiredHeight + 100 });

m.drawAll(StackFrames);

m.save("stack_frames.svg");
