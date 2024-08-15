import React, { ReactNode, useState } from "react";
import { Box, Button, Menu } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

type MemoryModelsMenuPropTypes = {
    menuName: string;
    testId: string;
    menuItems: ReactNode;
};

export default function MemoryModelsMenu(props: MemoryModelsMenuPropTypes) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
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
                sx={{
                    textTransform: "none",
                    "& .MuiSvgIcon-root": {
                        transition: "transform 0.2s ease-in-out",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    },
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
