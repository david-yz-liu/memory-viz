import React, { useEffect, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import { SAMPLES } from "./sample";

type MemoryModelsSamplePropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    setConfigData: React.Dispatch<React.SetStateAction<object>>;
    onTextDataSubmit: () => void;
};

export default function MemoryModelsSample(props: MemoryModelsSamplePropTypes) {
    const [clickedBtnIndex, setClickedBtnIndex] = useState<Number>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (clickedBtnIndex !== null) {
            props.onTextDataSubmit();
        }
    }, [clickedBtnIndex]);

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
        <>
            <Button
                onClick={handleClick}
                data-testid="sample-inputs-menu"
                sx={{
                    textTransform: "none",
                    "& .MuiSvgIcon-root": {
                        transition: "transform 0.2s ease-in-out",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    },
                }}
            >
                Sample Inputs
                <ExpandMoreRoundedIcon />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {SAMPLES.map((sample, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleButtonClick(index, sample)}
                    >
                        {sample["name"]}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
