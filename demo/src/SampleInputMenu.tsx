import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { SAMPLES } from "./sample";

type MemoryModelsSamplePropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    setConfigData: React.Dispatch<React.SetStateAction<object>>;
    onTextDataSubmit: () => void;
};

export default function SampleInputMenu(props: MemoryModelsSamplePropTypes) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [clickedBtnIndex, setClickedBtnIndex] = useState<Number>(null);

    useEffect(() => {
        if (clickedBtnIndex !== null) {
            props.onTextDataSubmit();
        }
    }, [clickedBtnIndex]);

    const classes = {
        button: {
            textTransform: "none",
            "& .MuiSvgIcon-root": {
                transition: "transform 0.2s ease-in-out",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
            },
        },
    };

    const handleButtonClick = (index: Number, sample: Object) => {
        // Note: the following conversion to a string is inefficient, as the data is later parsed
        // back into JSON for rendering.
        // TODO: fix this.
        props.setTextData(JSON.stringify(sample["data"], null, 4));
        props.setConfigData((prevConfigData) => ({
            ...prevConfigData,
            ...sample["config"],
        }));
        setClickedBtnIndex(index);
    };

    return (
        <div>
            <Button onClick={handleClick} sx={classes.button}>
                Sample Input
                <ExpandMoreRoundedIcon />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {SAMPLES.map((sample, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleButtonClick(index, sample)}
                    >
                        {sample["name"]}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
