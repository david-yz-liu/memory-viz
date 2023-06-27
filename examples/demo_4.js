const {drawAutomated} = require("../dist/memory_models_rough.node.js");

const WIDTH = 1300;

const m = drawAutomated(
    "../docs/automated_json.json",
    WIDTH
)

m.save("../docs/images/demo_4.svg")