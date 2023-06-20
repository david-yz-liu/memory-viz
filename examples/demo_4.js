const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems} = require("../dist/automate.js")
const { MemoryModel } = require("../dist/index.js")
const fs = require("fs");

const WIDTH = 1300;

const m = drawAutomated(
    "../docs/automated_json.json",
    WIDTH
)

console.log(m);

m.save("../docs/images/demo_4.svg")