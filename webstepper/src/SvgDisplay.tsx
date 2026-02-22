import React, { useRef, useEffect, useState } from "react";
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
    const [canvasHeight, setCanvasHeight] = useState(
        props.memoryVizData.configuration?.height || 1000
    );
    useEffect(() => {
        if (props.memoryVizData.memoryVizInput && canvasRef.current) {
            console.log(props.memoryVizData.memoryVizInput);
            try {
                console.log("drawing");
                console.log(canvasRef.current.height);
                const updatedHeight = props.memoryVizData.configuration?.height || 0;
                const m = memoryViz.draw(
                    structuredClone(props.memoryVizData.memoryVizInput),
                    true,
                    { width: canvasWidth, ...props.memoryVizData.configuration }
                );
                setCanvasHeight(updatedHeight || m.height);
                canvasRef.current.height = updatedHeight || m.height;
                console.log(canvasRef.current.height);
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
                        height={canvasHeight}
                    />
                </TransformComponent>
            </TransformWrapper>
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
