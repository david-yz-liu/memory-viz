import React from "react";
import SvgDisplay from "./SvgDisplay";

const DEMO_OBJECTS = [
    {
        isClass: true,
        name: "__main__",
        id: null,
        value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
        stack_frame: true,
    },
    {
        isClass: false,
        name: "str",
        id: 19,
        value: "David is cool!",
        style: ["highlight"],
    },
    { isClass: false, name: "int", id: 13, value: 7 },
];

export default function App() {
    return (
        <>
            <section>
                <h2>Input</h2>
                <pre>{JSON.stringify(DEMO_OBJECTS)}</pre>
            </section>
            <SvgDisplay />
        </>
    );
}
