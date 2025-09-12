import React from "react";
import { Box, Link, Stack, Typography, IconButton } from "@mui/material";
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
                    <Stack direction="row" alignItems="baseline" spacing={1}>
                        <h1 style={{ marginBottom: 0 }}>MemoryViz Demo</h1>
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
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                                    />
                                </svg>
                            )}
                        </IconButton>
                    </Stack>
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
