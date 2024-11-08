import React, { useRef, useEffect } from "react";
import { Paper } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./css/styles.css";

type SvgDisplayPropTypes = {
    svgPath: string;
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadAndDrawSvg = async () => {
            try {
                const response = await fetch(props.svgPath);
                const blob = await response.blob();
                const image = new Image();
                image.src = URL.createObjectURL(blob);
                image.onload = () => {
                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d");
                    context.clearRect(0, 0, image.width, image.height);
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0);
                };
            } catch (error) {
                console.error(error);
            }
        };
        loadAndDrawSvg();
    }, [props.svgPath]);

    return (
        <Paper
            className="svg-display"
            sx={{ bgcolor: "primary.paper" }}
            variant="outlined"
        >
            <TransformWrapper
                minScale={0.2}
                wheel={{ step: 0.2, smoothStep: 0.01 }}
            >
                <TransformComponent>
                    <canvas
                        data-testid="memory-models-canvas"
                        ref={canvasRef}
                    />
                </TransformComponent>
            </TransformWrapper>
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
