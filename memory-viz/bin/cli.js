#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { draw } = require("memory-viz");

const filePath = process.argv[2];
const absolutePath = path.resolve(filePath);
const fileContent = fs.readFileSync(absolutePath, "utf8");
const data = JSON.parse(fileContent);

const m = draw(data, true, { width: 1300 });

m.save("my_demo.svg");
