// const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems} = require("../dist/automate.js")
const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems, MemoryModel } =
    require("../dist/memory_models_rough.node.js");

const fs = require("fs");
const WIDTH = 1300;

const json_string = fs.readFileSync("../docs/automated_json.json", "utf-8");
const objs = JSON.parse(json_string);

const m = drawAutomated(
    objs,
    WIDTH,
    {padding: 60, top_margin: 50, bottom_margin: 50, left_margin: 80, right_margin:80}
)


// Saving to a file
m.save("../docs/images/demo_4.svg")
