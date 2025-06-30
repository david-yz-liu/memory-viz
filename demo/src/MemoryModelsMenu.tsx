import React, { ReactNode, useState } from "react";
import { Box, Button, Menu } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SettingsIcon from "@mui/icons-material/Settings";
import "./css/styles.css";

type MemoryModelsMenuPropTypes = {
    menuName: string;
    testId: string;
    menuItems: ReactNode;
};

export default function MemoryModelsMenu(props: MemoryModelsMenuPropTypes) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const getIcon = () => {
        const name = props.menuName.toLowerCase();
        if (name.includes("sample")) return <LightbulbIcon />;
        if (name.includes("rendering") || name.includes("options"))
            return <SettingsIcon />;
        return null;
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                data-testid={props.testId}
                className={`menu-button ${open ? "open" : ""}`}
                startIcon={getIcon()}
                sx={{
                    minWidth: "180px",
                    whiteSpace: "nowrap",
                }}
            >
                {props.menuName}
                <ExpandMoreRoundedIcon />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <Box>{props.menuItems}</Box>
            </Menu>
        </>
    );
}
