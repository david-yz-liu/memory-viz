import React from "react";
import {
    Box,
    Link,
    Stack,
    Typography,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import { SunIcon, MoonIcon, LanguageIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import lightLogo from "../../assets/logo_square.png";
import darkLogo from "../../assets/logo_square_dark.png";

interface HeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function Header({ isDarkMode, toggleTheme }: HeaderProps) {
    const { t, i18n } = useTranslation();
    const logo = isDarkMode ? darkLogo : lightLogo;

    // Language switcher state
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLanguageClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        handleLanguageClose();
    };

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
                    <IconButton
                        onClick={handleLanguageClick}
                        color="inherit"
                        aria-label="Change language"
                    >
                        <LanguageIcon
                            style={{ width: "30px", height: "30px" }}
                        />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleLanguageClose}
                    >
                        <MenuItem onClick={() => changeLanguage("en")}>
                            English
                        </MenuItem>
                        <MenuItem onClick={() => changeLanguage("fr")}>
                            Français
                        </MenuItem>
                    </Menu>
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
