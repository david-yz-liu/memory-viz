import React, { useRef, useEffect } from "react";
import mem from "memory-viz";
import { Paper } from "@mui/material";
import { configDataPropTypes } from "./MemoryModelsUserInput";

type SvgDisplayPropTypes = {
    jsonResult: object | null;
    configData: configDataPropTypes;
    setSvgResult: React.Dispatch<React.SetStateAction<string>>;
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);
    const canvasWidth = 1300;
    const canvasHeight = 1000;

    useEffect(() => {
        if (props.jsonResult !== null) {
            // deep copy jsonResult as mem.draw mutates input JSON
            // https://github.com/david-yz-liu/memory-viz/pull/20#discussion_r1513235452
            const jsonResultCopy = structuredClone(props.jsonResult);
            const m = mem.draw(jsonResultCopy, props.configData.useAutomation, {
                ...props.configData.overallDrawConfig,
                width: canvasWidth,
            });
            props.setSvgResult(m.serializeSVG());
            m.clear(canvasRef.current);
            m.render(canvasRef.current);
        }
    }, [props.jsonResult]);

    return (
        <Paper
            sx={{
                height: 500,
                overflow: "auto",
            }}
            variant="outlined"
        >
            <canvas
                data-testid="memory-models-canvas"
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                style={{
                    width: canvasWidth,
                    height: canvasHeight,
                }}
            />
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
