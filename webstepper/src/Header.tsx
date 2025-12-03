import React from "react";
import { Box, Link, Stack, Typography, IconButton } from "@mui/material";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import lightLogo from "../../assets/logo_square.png";
import darkLogo from "../../assets/logo_square_dark.png";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function Header({ isDarkMode, toggleTheme }: HeaderProps) {
    const { t } = useTranslation();
    const logo = isDarkMode ? darkLogo : lightLogo;

    return (
        <header className="container-fluid">
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    <Typography variant="h1" color="textPrimary">
                        {t("header.title")}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {t("header.subtitle")}{" "}
                        <Link
                            href="https://github.com/david-yz-liu/memory-viz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t("header.library")}
                        </Link>{" "}
                        {t("header.libraryText")}
                    </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <LanguageSwitcher />
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        aria-label={t("header.toggleTheme")}
                    >
                        {isDarkMode ? <MoonIcon /> : <SunIcon />}
                    </IconButton>
                    <img src={logo} alt="MemoryViz Logo" />
                </Stack>
            </Stack>
        </header>
    );
}
