import React, { useState } from "react";
import Header from "./Header";
import { Button, Box, Typography, Stack } from "@mui/material";
import SvgDisplay from "./SvgDisplay";
import CodeDisplay from "./CodeDisplay";

export default function App() {
    const [step, setStep] = useState<number>(0);
    // TODO: remove this and replace it with actual stuff lol
    const codeText = `num = 123
some_string = "Hello, world"
num2 = 321
arr = [some_string, "string 123321"]`;
    const limit = codeText.split("\n").length;
    const handleStep = (newStep: number) => {
        setStep(Math.min(Math.max(newStep, 0), limit - 1));
    };
    const svgPath = `/images/snapshot-${step}.svg`;

    return (
        <main className="container">
            <Header />
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <h2>Code</h2>
                    <Typography>Line: {step + 1}</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "80%",
                        }}
                    >
                        <CodeDisplay
                            text={codeText}
                            startingLineNumber={Math.max(step - 10, 1)}
                            highlightLine={step + 1}
                        />
                        <Box sx={{ display: "flex" }}>
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
                    <SvgDisplay svgPath={svgPath} />
                </Box>
            </Stack>
        </main>
    );
}
