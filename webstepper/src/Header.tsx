import React from "react";
import { Box, Link, Stack, Typography, IconButton } from "@mui/material";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import lightLogo from "../../assets/logo_square.png";
import darkLogo from "../../assets/logo_square_dark.png";

interface HeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function Header({ isDarkMode, toggleTheme }: HeaderProps) {
    const logo = isDarkMode ? darkLogo : lightLogo;

    return (
        <header className="container-fluid">
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    <Typography variant="h1" color="textPrimary">
                        MemoryViz Webstepper
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
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
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <MoonIcon /> : <SunIcon />}
                    </IconButton>
                    <img src={logo} alt="MemoryViz Logo" />
                </Stack>
            </Stack>
        </header>
    );
}
