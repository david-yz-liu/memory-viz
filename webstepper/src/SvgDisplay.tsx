import React, { useRef, useEffect } from "react";
import { Paper } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import memoryViz from "../../memory-viz/src"; // Load local version of memory-viz

const { draw: drawMemoryModel } = memoryViz;

type SvgDisplayPropTypes = {
    memoryVizInput: object[];
    configuration?: object;
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);
    const canvasWidth = 1300;
    const canvasHeight = 1000;

    useEffect(() => {
        if (props.memoryVizInput && canvasRef.current) {
            try {
                const m = drawMemoryModel(
                    structuredClone(props.memoryVizInput),
                    true,
                    { width: canvasWidth, ...props.configuration }
                );
                m.clear(canvasRef.current);
                m.render(canvasRef.current);
            } catch (error) {
                console.error(error);
            }
        }
    }, [props.memoryVizInput, props.configuration]);

    return (
        <Paper
            className="svg-display"
            elevation={3}
            sx={{ bgcolor: "primary.paper" }}
        >
            <TransformWrapper
                centerZoomedOut={true}
                minScale={0.2}
                wheel={{ step: 0.2, smoothStep: 0.01 }}
            >
                <TransformComponent>
                    <canvas
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                        data-testid="memory-models-canvas"
                        ref={canvasRef}
                        width={canvasWidth}
                        height={canvasHeight}
                    />
                </TransformComponent>
            </TransformWrapper>
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
