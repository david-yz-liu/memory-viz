import React, { useRef, useEffect } from "react";
import memoryViz from "../../memory-viz/src"; // Load local version of memory-viz
import { Paper } from "@mui/material";
import type { configDataPropTypes } from "./MemoryModelsUserInput.js";
import {
    TransformWrapper,
    TransformComponent,
    type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";

const { draw: drawMemoryModel } = memoryViz;

type SvgDisplayPropTypes = {
    jsonResult: object[] | null;
    configData: configDataPropTypes;
    setSvgResult: React.Dispatch<React.SetStateAction<string>>;
    setFailureBanner: React.Dispatch<React.SetStateAction<string>>;
    setIsValidJson: React.Dispatch<React.SetStateAction<boolean>>;
    isDarkMode?: boolean;
};

export default function SvgDisplay({
    isDarkMode = false,
    ...props
}: SvgDisplayPropTypes) {
    const containerRef = useRef<HTMLDivElement>(null);
    const transformRef = useRef<ReactZoomPanPinchContentRef>(null);
    const canvasWidth = 1300;

    const rawTheme = props.configData.overallDrawConfig?.theme;

    const draw = () => {
        if (props.jsonResult !== null) {
            try {
                // deep copy jsonResult as mem.draw mutates input JSON
                // https://github.com/david-yz-liu/memory-viz/pull/20#discussion_r1513235452
                const jsonResultCopy = structuredClone(props.jsonResult);
                let resolvedTheme;
                if (rawTheme === "match") {
                    resolvedTheme = isDarkMode ? "dark" : undefined;
                } else {
                    resolvedTheme = rawTheme;
                }
                const m = drawMemoryModel(jsonResultCopy, {
                    ...props.configData.overallDrawConfig,
                    width: canvasWidth,
                    ...(resolvedTheme ? { theme: resolvedTheme } : {}),
                });

                const svgString = m.serializeSVG();
                props.setSvgResult(svgString);
                props.setFailureBanner("");
                props.setIsValidJson(true);

                const svgElement = new DOMParser().parseFromString(
                    svgString,
                    "image/svg+xml"
                ).documentElement as unknown as SVGSVGElement;
                containerRef.current.replaceChildren(svgElement);

                m.attachInteractivity(svgElement);

                // reset zoom and pan to default when redrawing
                transformRef.current?.setTransform(0, 0, 1, 0);
            } catch (error) {
                props.setSvgResult(null);
                props.setFailureBanner(error.message);
                props.setIsValidJson(false);
            }
        } else {
            props.setSvgResult(null);
        }
    };

    useEffect(() => {
        draw();
    }, [
        props.jsonResult,
        props.configData.overallDrawConfig.seed,
        props.configData.overallDrawConfig.theme,
    ]);

    useEffect(() => {
        if (rawTheme === "match") {
            draw();
        }
    }, [rawTheme, isDarkMode]);

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
                ref={transformRef}
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
                            height: "100%",
                            width: "100%",
                        }}
                    />
                </TransformComponent>
            </TransformWrapper>
        </Paper>
    );
}

export type { SvgDisplayPropTypes };
