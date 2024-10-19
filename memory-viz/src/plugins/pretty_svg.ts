import type { NewPlugin, OldPlugin } from "pretty-format";
import pretty from "pretty";
import { parse } from "node-html-parser";

export const serialize: NewPlugin["serialize"] = (val) => {
    return pretty(val);
};

export const test: NewPlugin["test"] = (val: any) => {
    const root = parse(val);
    return root.firstChild.rawTagName === "svg";
};

export const plugin: NewPlugin = {
    test,
    serialize,
};

export default plugin;
