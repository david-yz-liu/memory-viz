import React, { useState } from "react";
import SvgDisplay from "./SvgDisplay";
import { MemoryModels, MemoryModel } from "./MemoryModels";

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

    //TODO: finish
    function isMemoryModel(obj: any): obj is MemoryModel {
        return (
            (typeof obj.isClass === "boolean" &&
                typeof obj.name === "string" &&
                obj.isClass &&
                obj.id === null) ||
            (!obj.isClass &&
                (typeof obj.id === "string" || typeof obj.id === "number"))
        );
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        //TODO: use isMemoryModel for input validation
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
