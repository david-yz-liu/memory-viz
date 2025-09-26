import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Button, Box, Typography, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SvgDisplay from "./SvgDisplay";
import CodeDisplay from "./CodeDisplay";
import placeholder from "./placeholder";

if (typeof window === "object" && process.env.NODE_ENV !== "production") {
    window.svgArray = placeholder.svgArray;
    window.codeText = placeholder.codeText;
}

interface AppProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function App({ isDarkMode, toggleTheme }: AppProps) {
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
        <>
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <main className="container-fluid">
                <Stack direction="row" spacing={2} sx={{ height: "100%" }}>
                    <Stack direction="column" sx={{ width: "45%" }}>
                        <Typography
                            variant="h2"
                            color="textPrimary"
                            gutterBottom
                            sx={{
                                fontSize: "29.75px",
                                fontWeight: 700,
                                mt: 2,
                            }}
                        >
                            Code
                        </Typography>
                        <Stack direction="row" className="code-controls">
                            <Typography>
                                Step {step + 1}/{limit}
                            </Typography>
                            <Button
                                disabled={step === 0}
                                onClick={() => handleStep(-1)}
                                startIcon={<ArrowBackIcon />}
                            >
                                Back
                            </Button>
                            <Button
                                disabled={step === limit - 1}
                                onClick={() => handleStep(1)}
                                endIcon={<ArrowForwardIcon />}
                            >
                                Next
                            </Button>
                        </Stack>
                        <Box className="code-display">
                            <CodeDisplay
                                text={codeText}
                                startingLineNumber={
                                    window.svgArray[0].lineNumber
                                }
                                highlightLine={window.svgArray[step].lineNumber}
                            />
                        </Box>
                    </Stack>
                    <Stack direction="column" sx={{ width: "55%" }}>
                        <Typography
                            variant="h2"
                            color="textPrimary"
                            gutterBottom
                            sx={{
                                fontSize: "29.75px",
                                fontWeight: 700,
                                mt: 2,
                            }}
                        >
                            Memory Visualization
                        </Typography>
                        <SvgDisplay step={step} />
                    </Stack>
                </Stack>
            </main>
        </>
    );
}
