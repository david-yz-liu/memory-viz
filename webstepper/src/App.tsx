import React, { useState } from "react";
import Header from "./Header";
import { Button, Box, Typography, Stack } from "@mui/material";
import SvgDisplay from "./SvgDisplay";
import CodeDisplay from "./CodeDisplay";
import "./css/styles.css";

export default function App() {
    const [step, setStep] = useState<number>(0);
    // TODO: replace this with actual code to display
    const codeText = `num = 123
some_string = "Hello, world"
num2 = 321
arr = [some_string, "string 123321"]`;
    const limit = codeText.split("\n").length;
    const handleStep = (newStep: number) => {
        setStep(Math.min(Math.max(newStep, 0), limit - 1));
    };

    return (
        <main className="container">
            <Header />
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <h2>Code</h2>
                    <Typography>
                        Line: {window.svgArray[step].lineNumber}
                    </Typography>
                    <Box className="code-display">
                        <CodeDisplay
                            text={codeText}
                            startingLineNumber={Number(
                                window.svgArray[0].lineNumber
                            )}
                            highlightLine={Number(
                                window.svgArray[step].lineNumber
                            )}
                        />
                        <Box className="button-container">
                            <Button onClick={() => handleStep(step - 1)}>
                                Back
                            </Button>
                            <Button onClick={() => handleStep(step + 1)}>
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
