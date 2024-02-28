import React, { useRef, useEffect } from "react";
import mem from "../../src/index"; // TODO: replace with import of the package after it's been published
import { Typography } from "@mui/material";

type SvgDisplayPropTypes = {
    jsonResult: object;
    setSvgResult: React.Dispatch<React.SetStateAction<string>>;
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);
    const canvasWidth = 1300;
    const canvasHeight = 1000;

    useEffect(() => {
        if (props.jsonResult !== null) {
            const m = mem.draw(props.jsonResult, true, { width: canvasWidth });
            props.setSvgResult(m.serializeSVG());
            m.clear(canvasRef.current);
            m.render(canvasRef.current);
        }
    }, [props.jsonResult]);

    return (
        <canvas
            data-testid="memory-models-canvas"
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
        />
    );
}
