import React, { useRef, useEffect } from "react";
import { Paper } from "@mui/material";
import {
    TransformWrapper,
    TransformComponent,
    ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import memoryViz from "memory-viz";

type SvgDisplayPropTypes = {
    memoryVizData: {
        memoryVizInput: object[];
        lineNumber: number;
        configuration?: {
            width?: number;
            height?: number;
            [key: string]: any;
        };
    };
    isDarkMode?: boolean;
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const containerRef = useRef<HTMLDivElement>(null);
    const transformRef = useRef<ReactZoomPanPinchContentRef>(null);
    const canvasWidth = props.memoryVizData.configuration?.width ?? 1300;
    useEffect(() => {
        if (props.memoryVizData.memoryVizInput && containerRef.current) {
            try {
                const resolvedTheme = props.isDarkMode ? "dark" : undefined;
                const m = memoryViz.draw(
                    structuredClone(props.memoryVizData.memoryVizInput),
                    {
                        width: canvasWidth,
                        ...props.memoryVizData.configuration,
                        ...(resolvedTheme ? { theme: resolvedTheme } : {}),
                        interactive: false,
                    }
                );
                const svgElement = m.createInteractiveSVGElement();

                // prevent svg styles from leaking into the rest of the page by rendering it in a shadow DOM
                const shadowRoot =
                    containerRef.current.shadowRoot ??
                    containerRef.current.attachShadow({ mode: "open" });
                shadowRoot.replaceChildren(svgElement);

                // reset zoom and pan to default when redrawing
                transformRef.current?.setTransform(0, 0, 1, 0);
            } catch (error) {
                console.error(error);
            }
        }
    }, [props.memoryVizData, props.isDarkMode]);

    return (
        <Paper
            className="svg-display"
            elevation={3}
            sx={{ bgcolor: "primary.paper" }}
        >
            <TransformWrapper
                ref={transformRef}
                centerZoomedOut={true}
                minScale={0.2}
                wheel={{ step: 0.2, smoothStep: 0.01 }}
            >
                <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                >
                    <div
                        data-testid="memory-models-svg"
                        ref={containerRef}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </TransformComponent>
            </TransformWrapper>
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
