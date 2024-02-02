import React, { useRef, useEffect } from "react";
import mem from "../../src/index"; // TODO: replace with import of the package after it's been published

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

export default function SvgDisplay(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (props.jsonResult.length > 0) {
            const m = mem.draw(props.jsonResult, true, { width: 1300 });
            m.render(canvasRef.current);
        }
    }, [props.jsonResult]);

    return (
        <section>
            <h2>Output</h2>
            <canvas ref={canvasRef} width={1000} height={1000} />;
        </section>
    );
}
