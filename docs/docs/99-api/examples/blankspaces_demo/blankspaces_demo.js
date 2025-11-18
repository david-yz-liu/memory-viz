/**
 * This file demonstrates the ability to leave "blanks" when the 'automated.md' option is on.
 *
 * To define a blank box, you specify it as an object in the array (the classic array of objects) with three attributes:
 * - type: This must be equal to ".blank"
 * - width: the desired width of the blank box (I say box but in reality there aren't any borders)
 * - height: the desired height of the blank box
 *
 * NOTE:
 *   All these attributes are mandatory, and any additional attributes will not have any effect whatsoever in the
 *   rendering of the blank space.
 *   Furthermore, note that configuration.sort_by should be null, as otherwise you cannot control where the
 *   blank space will be located.
 *
 * OUTPUT FILE: ~/examples/blankspaces_demo/blankspaces_demo.svg"
 */

import { draw } from "memory-viz";

const WIDTH = 1300;

const listOfObjs = [
    {
        type: ".frame",
        name: "__main__",
        id: null,
        value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
    },
    { type: ".frame", width: 100, height: 200 },
    {
        type: ".frame",
        name: "func",
        id: null,
        value: { age: 12, name: 17 },
    },
    { type: "list", id: 82, value: [19, 43, 28, 49] },
    {
        type: "list",
        id: 84,
        value: [32, 10, 90, 57],
        show_indexes: true,
    },
    { type: "int", id: 19, value: 1969 },
    { type: ".blank", width: 100, height: 200 },
    { type: "bool", id: 32, value: true },
    { type: "str", id: 43, value: "David is cool" },
    { type: ".blank", width: 200, height: 150 },
    { type: "tuple", id: 11, value: [82, 76] },
];

const configuration = {
    width: WIDTH,
    padding: 30,
    right_margin: 20,
    bottom_margin: 20,
    sort_by: null,
};

const m = draw(listOfObjs, true, configuration);

m.save("blankspaces_demo.svg");
