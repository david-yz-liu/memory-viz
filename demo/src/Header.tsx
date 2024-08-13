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
                mb: "1rem",
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "650", color: "black", mb: "0.25rem" }}
                >
                    MemoryViz Demo
                </Typography>
                <Typography variant="body2">
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
                    marginRight: "1rem",
                    width: "12%",
                }}
            />
        </Box>
    );
}
