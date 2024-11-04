import React, { useState } from "react";
import Header from "./Header";
import { Button, Box, Typography, Stack } from "@mui/material";
import SvgDisplay from "./SvgDisplay";
import CodeDisplay from "./CodeDisplay";

export default function App() {
    const [step, setStep] = useState<number>(1);
    const limit = 10;
    const handleStep = (newStep: number) => {
        setStep(Math.min(Math.max(newStep, 1), limit - 1));
    };
    const svgPath = `/images/snapshot-${step}.svg`;

    // TODO: remove this and replace it with actual stuff lol
    const codeText = `i = 0
while i < 7:
    print("hello world")
    i += 1

print("this is some sample code")
i = i // 2
    `;

    return (
        <main className="container">
            <Header />
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <h2>Code</h2>
                    <Typography>Line: {step}</Typography>
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
                            highlightLine={step}
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
