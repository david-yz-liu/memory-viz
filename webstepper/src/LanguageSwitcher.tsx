import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        handleClose();
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                color="inherit"
                aria-label="Change language"
            >
                <LanguageIcon style={{ width: "30px", height: "30px" }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => changeLanguage("en")}>
                    English
                </MenuItem>
                <MenuItem onClick={() => changeLanguage("fr")}>
                    Français
                </MenuItem>
            </Menu>
        </>
    );
}
