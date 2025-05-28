// Custom pretty-format plugin for serializing SVG elements
// See https://github.com/jestjs/jest/tree/main/packages/pretty-format#writing-plugins for more information

import { NewPlugin } from "pretty-format";
import pretty from "pretty";
import { parse, HTMLElement } from "node-html-parser";

export const serialize: NewPlugin["serialize"] = (val: HTMLElement) => {
    return pretty(val);
};

export const test: NewPlugin["test"] = (val: any) => {
    const root = parse(val);
    if (root.firstChild !== undefined) {
        return root.firstChild.rawTagName === "svg";
    }
    return false;
};

export const plugin: NewPlugin = {
    test,
    serialize,
};

export default plugin;
