import React, { useRef, useEffect } from "react";
import mem from "memory-viz";
import { Paper } from "@mui/material";
import { configDataPropTypes } from "./MemoryModelsUserInput.js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type SvgDisplayPropTypes = {
    jsonResult: object | null;
    configData: configDataPropTypes;
    setSvgResult: React.Dispatch<React.SetStateAction<string>>;
    isDarkMode: boolean;
};

export default function SvgDisplay(props: SvgDisplayPropTypes) {
    const canvasRef = useRef(null);
    const canvasWidth = 1300;
    const canvasHeight = 1000;

    const rawTheme = props.configData.overallDrawConfig?.theme;

    const draw = () => {
        if (props.jsonResult !== null) {
            try {
                // deep copy jsonResult as mem.draw mutates input JSON
                // https://github.com/david-yz-liu/memory-viz/pull/20#discussion_r1513235452
                const jsonResultCopy = structuredClone(props.jsonResult);
                let resolvedTheme;
                if (rawTheme === "match") {
                    resolvedTheme = props.isDarkMode ? "dark" : undefined;
                } else {
                    resolvedTheme = rawTheme;
                }
                const m = mem.draw(
                    jsonResultCopy,
                    props.configData.useAutomation,
                    {
                        ...props.configData.overallDrawConfig,
                        width: canvasWidth,
                        ...(resolvedTheme ? { theme: resolvedTheme } : {}),
                    }
                );
                props.setSvgResult(m.serializeSVG());
                m.clear(canvasRef.current);
                m.render(canvasRef.current);
            } catch (error) {
                props.setSvgResult(null);
                throw error;
            }
        } else {
            props.setSvgResult(null);
        }
    };

    useEffect(() => {
        draw();
    }, [props.jsonResult, props.configData.useAutomation]);

    useEffect(() => {
        if (rawTheme === "match") {
            draw();
        }
    }, [rawTheme, props.isDarkMode]);

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
