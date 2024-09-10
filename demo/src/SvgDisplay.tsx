import React, { useRef, useEffect } from "react";
import mem from "memory-viz";
import { Paper, Box } from "@mui/material";
import { configDataPropTypes } from "./MemoryModelsUserInput";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            variant="outlined"
        >
            <div style={{ height: 500, width: "100%" }}>
                <TransformWrapper>
                    <TransformComponent>
                        <canvas
                            style={{
                                height: 500,
                                width: "100%",
                                objectFit: "contain",
                            }}
                            data-testid="memory-models-canvas"
                            ref={canvasRef}
                            width={canvasWidth}
                            height={500}
                        />
                    </TransformComponent>
                </TransformWrapper>
            </div>

            {/* <TransformWrapper minScale={0.2} wheel={{ step: 0.01 }}>
                <TransformComponent>
                    <canvas
                        
                    />
                </TransformComponent>
            </TransformWrapper> */}
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
