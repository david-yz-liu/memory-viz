const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems} = require("../dist/automate.js")
const { MemoryModel } = require("../dist/index.js")
const fs = require("fs");

const WIDTH = 1300;

const m = drawAutomated(
    "../docs/automated_json.json",
    WIDTH
)

m.save("../docs/images/demo_4.svg")



// With beautified function
const m2 = drawAutomated(
    "../docs/beautified_model.json",
    WIDTH
)

m2.save("../docs/images/demo_4_BEAUT.svg")