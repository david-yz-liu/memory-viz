const { drawAutomated, separateJSON, getSize } = require("../dist/memory_models_rough.node")

console.log(drawAutomated)

console.log(getSize({"isClass": true, "name": "Person", "id": 99, "value": {"age": 12, "name": 17}, "stack_frame": false}))
