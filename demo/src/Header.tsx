import React from "react";
import { Box, Link, Typography } from "@mui/material";

export default function Header() {
    return (
        <Box sx={{ mb: "1rem" }}>
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
    );
}
