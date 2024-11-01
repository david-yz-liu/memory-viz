import React, { useState } from "react";
import Header from "./Header";
import { Button, Box, Typography, Stack } from "@mui/material";
import SvgDisplay from "./SvgDisplay";

export default function App() {
    const [step, setStep] = useState<number>(0);
    const limit = 4;
    const handleStep = (newStep: number) => {
        setStep(Math.min(Math.max(newStep, 0), limit - 1));
    };
    const svgPath = `/images/snapshot-${step}.svg`;

    return (
        <main className="container">
            <Header />
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <h2>Input</h2>
                    <Typography>Line: {step}</Typography>
                    <Box sx={{ display: "flex" }}>
                        <Button onClick={() => handleStep(step - 1)}>
                            Back
                        </Button>
                        <Button onClick={() => handleStep(step + 1)}>
                            Next
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ width: "60%" }}>
                    <h2>Output</h2>
                    <SvgDisplay svgPath={svgPath} />
                </Box>
            </Stack>
        </main>
    );
}
