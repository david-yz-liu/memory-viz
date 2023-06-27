// const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems} = require("../dist/automate.js")
const { draw } = require("../dist/memory_models_rough.node.js");

const fs = require("fs");
const WIDTH = 1300;

const json_string = fs.readFileSync("../docs/automated_json.json", "utf-8");
const objs = JSON.parse(json_string);

const m = draw(
    objs,
    true,
    WIDTH,
    {padding: 60, top_margin: 50, bottom_margin: 50, left_margin: 80, right_margin:80}
)

m.save("../docs/images/demo_5B.svg")


//
// // With beautified function
// const m2 = drawAutomated(
//     "../docs/beautified_model.json",
//     WIDTH
// )
//
// m2.save("../docs/images/demo_4_BEAUT.svg")