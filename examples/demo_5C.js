// const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems} = require("../dist/automate.js")
const { draw } = require("../dist/memory_models_rough.node.js");

const WIDTH = 1300;

const m = draw(
    "../docs/automated_json.json",
    true,
    WIDTH,
    {padding: 60, top_margin: 50, bottom_margin: 50, left_margin: 80, right_margin:80}
)

m.save("../docs/images/demo_5C.svg")


