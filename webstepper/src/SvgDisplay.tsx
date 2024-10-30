import React, { useRef, useEffect } from "react";
import { Paper } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type SvgDisplayPropTypes = {
    step: number;
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);
    const canvasWidth = 1300;
    const canvasHeight = 1000;

    useEffect(() => {
        const loadAndDrawSvg = async () => {
            const svgSource = await import(
                `../src/images/snapshot-${props.step}.svg`
            );
            const image = new Image();
            image.src = svgSource.default;
            image.onload = () => {
                const context = canvasRef.current.getContext("2d");
                context.clearRect(0, 0, canvasWidth, canvasHeight);
                context.drawImage(image, 0, 0);
            };
        };
        loadAndDrawSvg();
    }, [props.step]);

    return (
        <Paper
            sx={{
                bgcolor: `primary.paper`,
                height: 500,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            variant="outlined"
        >
            <TransformWrapper
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
