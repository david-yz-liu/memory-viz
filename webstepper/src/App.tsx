import React, { useState } from "react";
import Header from "./Header";
import { Button, Box, Typography } from "@mui/material";

export default function App() {
    const [step, setStep] = useState<number>(0);
    // TODO: need to update the limits based on what we read from the svgs
    const limit = 10;
    const handleStep = (newStep: number) => {
        setStep(Math.min(Math.max(newStep, 0), limit));
    };
    return (
        <main className="container">
            <Header />
            <Typography>Line: {step}</Typography>
            <Box sx={{ display: "flex" }}>
                <Button onClick={() => handleStep(step - 1)}>Back</Button>
                <Button onClick={() => handleStep(step + 1)}>Next</Button>
            </Box>
        </main>
    );
}
