import React, { useRef, useEffect } from "react";
import mem from "../../src/index"; // TODO: replace with import of the package after it's been published

export default function SvgDisplay(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (props.jsonResult !== null) {
            const m = mem.draw(props.jsonResult, true, { width: 1300 });
            m.clear(canvasRef.current);
            m.render(canvasRef.current);
        }
    }, [props.jsonResult]);

    return (
        <>
            <canvas ref={canvasRef} width={1000} height={1000} />;
        </>
    );
}
