import React, { useRef, useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import memoryViz from "memory-viz";

type SvgDisplayPropTypes = {
    entities: object[];
    configuration?: {
        width?: number;
        height?: number;
        [key: string]: any;
    };
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);
    const [canvasDimensions, setCanvasDimensions] = useState({
        width: props.configuration?.width ?? 1300,
        height: 0
    });
    useEffect(() => {
        if (props.entities && canvasRef.current) {
            try {
                const m = memoryViz.draw(
                    structuredClone(props.entities),
                    true,
                    { width: canvasDimensions.width, ...props.configuration }
                );
                setCanvasDimensions({
                    width: canvasDimensions.width,
                    height: props.configuration?.width ?? m.height
                });
                m.clear(canvasRef.current);
                m.render(canvasRef.current);
            } catch (error) {
                console.error(error);
            }
        }
    }, [props.entities, props.configuration]);

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
                        width={canvasDimensions.width}
                        height={canvasDimensions.height}
                    />
                </TransformComponent>
            </TransformWrapper>
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
