import React from "react";
import { Box, Link, Typography } from "@mui/material";
import image from "../../assets/logo_square.png";

export default function Header() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Box>
                <Typography variant="h1">MemoryViz Demo</Typography>
                <Typography variant="subtitle1">
                    Demos of the{" "}
                    <Link
                        href="https://github.com/david-yz-liu/memory-viz"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        MemoryViz
                    </Link>{" "}
                    Javascript library for visualizing Python memory. Click{" "}
                    <Link
                        href="https://www.cs.toronto.edu/~david/memory-viz/docs/api/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        here
                    </Link>{" "}
                    for documentation.
                </Typography>
            </Box>
            <img
                src={image}
                alt="MemoryViz Logo"
                style={{
                    width: "12%",
                }}
            />
        </Box>
    );
}
