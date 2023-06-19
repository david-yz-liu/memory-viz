const { drawAutomated, separateJSON, getSize, drawAutomatedOtherItems, drawAutomatedStackFrames} = require("../dist/automate.js")
const { MemoryModel } = require("../dist/index.js")

const fs = require("fs");
console.log("1098301980912318209: " + fs)
// console.log(drawAutomated)
//
// console.log("))))))))))))))))(((((((((((((((()))))))))))))))))(((((((((((((((((((()))))))))))))))))")
// console.log(getSize({"isClass": true, "name": "Person", "id": 99,
//     "value": {"age": 12, "name": 17}, "stack_frame": false}))


const WIDTH = 1300;

const {StackFrames, requiredHeight} = drawAutomatedStackFrames(
    [
        {"isClass": true, "name": "__main__", "id": 82, "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11}, "stack_frame": true},
        {"isClass": true, "name": "Person", "id": 99, "value": {"age": 12, "name": 17}, "stack_frame": true},
        {"isClass": true, "name": "Animal", "id": 99, "value": {"age": 2, "name": 94}, "stack_frame": true}
    ],
    WIDTH * 0.2
)


const m = new MemoryModel({width: WIDTH, height: requiredHeight + 100}); ///// + 50 fix!!!

console.log(StackFrames, requiredHeight)
m.drawAll(StackFrames)
m.save("../docs/images/demo_5.svg")