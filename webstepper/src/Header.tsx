import React from "react";
import { Box, Link, Stack, Typography, useMediaQuery } from "@mui/material";
import lightLogo from "../../assets/logo_square.png";
import darkLogo from "../../assets/logo_square_dark.png";

export default function Header() {
    const logo = useMediaQuery("(prefers-color-scheme: dark)")
        ? darkLogo
        : lightLogo;

    return (
        <header className="container-fluid">
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    <h1>MemoryViz Webstepper</h1>
                    <Typography variant="subtitle1">
                        A web-based interactive tool for visualizing Python
                        memory, based on the{" "}
                        <Link
                            href="https://github.com/david-yz-liu/memory-viz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            MemoryViz
                        </Link>{" "}
                        Javascript library.
                    </Typography>
                </Box>
                <img src={logo} alt="MemoryViz Logo" className="logo" />
            </Stack>
        </header>
    );
}
