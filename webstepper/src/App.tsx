import React, { useState } from "react";
import Header from "./Header";
import { Button, Box, Typography } from "@mui/material";
import CodeDisplay from "./CodeDisplay";

export default function App() {
    const [step, setStep] = useState<number>(1);
    // TODO: need to update the limits based on what we read from the svgs
    const limit = 10;
    const handleStep = (newStep: number) => {
        setStep(Math.min(Math.max(newStep, 1), limit));
    };

    // TODO: remove this and replace it with actual text lol
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
            <Typography>Line: {step}</Typography>
            <Box sx={{ display: "flex", height: "80vh", width: "80vw" }}>
                <CodeDisplay
                    text={codeText}
                    startingLineNumber={Math.max(step - 10, 1)}
                    highlightLine={step}
                />
            </Box>
            <Box sx={{ display: "flex" }}>
                <Button onClick={() => handleStep(step - 1)}>Back</Button>
                <Button onClick={() => handleStep(step + 1)}>Next</Button>
            </Box>
        </main>
    );
}
