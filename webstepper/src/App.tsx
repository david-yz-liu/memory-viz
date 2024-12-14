import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Button, Box, Typography, Stack } from "@mui/material";
import SvgDisplay from "./SvgDisplay";
import CodeDisplay from "./CodeDisplay";
import placeholder from "./placeholder";
import "./css/styles.css";

if (typeof window === "object" && process.env.NODE_ENV !== "production") {
    window.svgArray = placeholder.svgArray;
    window.codeText = placeholder.codeText;
}

export default function App() {
    const [step, setStep] = useState<number>(0);
    const codeText = window.codeText;
    const limit = window.svgArray.length;

    const handleStep = (offset: number) => {
        setStep((step) => Math.min(Math.max(step + offset, 0), limit - 1));
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key == "ArrowLeft") {
                handleStep(-1);
            }
            if (event.key == "ArrowRight") {
                handleStep(1);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <main className="container">
            <Header />
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <h2>Code</h2>
                    <Typography>
                        Step {step + 1}/{limit}
                    </Typography>
                    <Box className="code-display">
                        <CodeDisplay
                            text={codeText}
                            startingLineNumber={window.svgArray[0].lineNumber}
                            highlightLine={window.svgArray[step].lineNumber}
                        />
                        <Box className="button-container">
                            <Button
                                disabled={step === 0}
                                onClick={() => handleStep(-1)}
                            >
                                Back
                            </Button>
                            <Button
                                disabled={step === limit - 1}
                                onClick={() => handleStep(1)}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ width: "60%" }}>
                    <h2>Memory diagrams</h2>
                    <SvgDisplay step={step} />
                </Box>
            </Stack>
        </main>
    );
}
