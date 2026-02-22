import React, { useRef, useEffect } from "react";
import { Paper } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import memoryViz from "memory-viz";

type SvgDisplayPropTypes = {
    memoryVizData:{
        memoryVizInput: object[];
        lineNumber: number;
        configuration?: {
            width?: number;
            height?: number;
            [key: string]: any;
        }
    }
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);
    const canvasWidth = props.memoryVizData.configuration?.width ?? 1300;
    useEffect(() => {
        if (props.memoryVizData.memoryVizInput && canvasRef.current) {
            try {
                const m = memoryViz.draw(
                    structuredClone(props.memoryVizData.memoryVizInput),
                    true,
                    { width: canvasWidth, ...props.memoryVizData.configuration }
                );
                canvasRef.current.height = props.memoryVizData.configuration?.height ?? m.height;
                m.clear(canvasRef.current);
                m.render(canvasRef.current);
            } catch (error) {
                console.error(error);
            }
        }
    }, [props.memoryVizData]);

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
                    />
                </TransformComponent>
            </TransformWrapper>
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
