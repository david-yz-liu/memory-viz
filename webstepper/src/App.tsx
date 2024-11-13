import React, { useState } from "react";
import Header from "./Header";
import { Button, Box, Typography, Stack } from "@mui/material";
import SvgDisplay from "./SvgDisplay";
import CodeDisplay from "./CodeDisplay";
import "./css/styles.css";

export default function App() {
    const [step, setStep] = useState<number>(0);
    // TODO: replace this with actual code to display
    const codeText = `num = [1, 2, 3]
for i in range(len(nums)):
    if i == 0:
        nums[i] = nums[i] + 1
    else:
        nums[i] = nums[i] * 2
`;
    const limit = Object.keys(window.svgArray).length;
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
                            <Button
                                disabled={step === 0}
                                onClick={() => handleStep(step - 1)}
                            >
                                Back
                            </Button>
                            <Button
                                disabled={step === limit - 1}
                                onClick={() => handleStep(step + 1)}
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
