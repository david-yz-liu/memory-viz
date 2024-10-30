import React from "react";
import { Box, Link, Stack, Typography, useMediaQuery } from "@mui/material";
import lightLogo from "../../assets/logo_square.png";
import darkLogo from "../../assets/logo_square_dark.png";
import { dark } from "@mui/material/styles/createPalette";

export default function Header() {
    const logo = useMediaQuery("(prefers-color-scheme: dark)")
        ? darkLogo
        : lightLogo;

    return (
        <header className="container">
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    <h1 style={{ marginBottom: 0 }}>MemoryViz Stepper</h1>
                    <Typography variant="subtitle1">
                        A web debugger for the{" "}
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
                    src={logo}
                    alt="MemoryViz Logo"
                    style={{
                        width: "100px",
                        objectFit: "contain",
                    }}
                />
            </Stack>
        </header>
    );
}
