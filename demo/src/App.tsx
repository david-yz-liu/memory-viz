import React, { useState } from "react";
import SvgDisplay from "./SvgDisplay";
import { MemoryModels, MemoryModel } from "./MemoryModels";
import { json } from "node:stream/consumers";

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
    const [formData, setFormData] = useState("");
    const [jsonResult, setJsonResult] = useState([]);

    const onSubmit = async (event) => {
        event.preventDefault();
        setJsonResult(JSON.parse(formData));
    };
    return (
        <>
            <MemoryModels
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
            <SvgDisplay jsonResult={jsonResult} />
        </>
    );
}
