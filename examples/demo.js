const { MemoryModel } = require("../dist/memory_models_rough.node")

const m = new MemoryModel({ width: 1300, height: 1100 })

m.drawClass(10, 10, "emphasize", null, { lst: 4 }, true)
m.drawClass(10, 160, "__main__", null, { sentence: 2, hi: null}, true)
m.drawObject(510, 10, "list", 2, [10, 11, 12], true)
m.drawObject(770, 10, "list", 3, [10, 11, 12], false)
m.drawObject(510, 200, "str", 10, "winter")
m.drawObject(760, 200, "int", 11, 999)
m.drawObject(1010, 200, "bool", 12, true)
m.drawObject(510, 400, "set", 4, [10, 11, 12, 23, 24])
m.drawObject(510, 600, "dict", 100, { 2: 3, 10: 20, hi: "bye" })

m.drawClass(
    800,
    600,
    "HockeyTeam",
    26,
    { name: 21, games_played: 5, wins: 11 },
    false
)

m.save("test.svg")
