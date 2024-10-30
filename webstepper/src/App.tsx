import React from "react";
import Header from "./Header";
import { Stack, Box } from "@mui/material";
import SvgDisplay from "./SvgDisplay";

export default function App() {
    // Load all SVGs here or import them when needed?
    const svgPaths = [
        "./images/snapshot-0.svg",
        "./images/snapshot-1.svg",
        "./images/snapshot-2.svg",
        "./images/snapshot-3.svg",
    ];

    return (
        <main className="container">
            <Header />
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <h2>Input</h2>
                </Box>
                <Box sx={{ width: "60%" }}>
                    <h2>Output</h2>
                    <SvgDisplay svgPath={svgPaths[0]} />
                </Box>
            </Stack>
        </main>
    );
}
