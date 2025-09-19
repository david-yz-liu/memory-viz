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
        <header className="container">
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    <Typography
                        variant="h1"
                        color="textPrimary"
                        gutterBottom
                        sx={{
                            fontSize: "34px",
                            fontWeight: 700,
                        }}
                    >
                        MemoryViz Demo
                    </Typography>
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
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        aria-label="Toggle theme"
                        size="small"
                        sx={{
                            padding: "2px",
                            minWidth: "auto",
                            width: "auto",
                            height: "auto",
                        }}
                    >
                        {isDarkMode ? (
                            <SunIcon
                                style={{ width: "30px", height: "30px" }}
                            />
                        ) : (
                            <MoonIcon
                                style={{ width: "30px", height: "30px" }}
                            />
                        )}
                    </IconButton>
                    <img
                        src={logo}
                        alt="MemoryViz Logo"
                        style={{
                            width: "100px",
                            objectFit: "contain",
                        }}
                    />
                </Stack>
            </Stack>
        </header>
    );
}
