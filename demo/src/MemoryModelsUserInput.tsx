import React, { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Input,
    TextField,
    Tooltip,
    Menu,
    MenuItem,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DownloadJSONButton from "./DownloadJSONButton";

interface configDataPropTypes {
    useAutomation: boolean;
    overallDrawConfig: {
        [key: string]: any;
    };
}

type MemoryModelsConfigInputPropTypes = {
    configData: configDataPropTypes;
    setConfigData: React.Dispatch<React.SetStateAction<object>>;
};

type MemoryModelsFileInputPropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    textData: string;
    setFailureBanner: React.Dispatch<React.SetStateAction<string>>;
    jsonResult: string | null;
};

type MemoryModelsTextInputPropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    textData: string;
};

type MemoryModelsUserInputPropTypes = MemoryModelsFileInputPropTypes &
    MemoryModelsTextInputPropTypes &
    MemoryModelsConfigInputPropTypes & {
        onTextDataSubmit: (event: React.MouseEvent<HTMLFormElement>) => void;
    };

function MemoryModelsFileInput(props: MemoryModelsFileInputPropTypes) {
    const [uploadedFileString, setUploadedFileString] = useState("");

    const onChange = (event) => {
        try {
            const uploadedFile = event.target.files[0];
            const fileReader = new global.FileReader();
            fileReader.readAsText(uploadedFile, "UTF-8");
            fileReader.onload = (event) => {
                const fileString = event.target.result as string;
                setUploadedFileString(fileString);
                props.setTextData(fileString);
            };
        } catch (error) {
            const errorMessage = `Error reading uploaded file as text. Please ensure it's in UTF-8 encoding: ${error.message}`;
            console.error(errorMessage);
            props.setTextData(null);
            props.setFailureBanner(errorMessage);
        }
    };

    const onLoadButtonClick = () => {
        props.setTextData(uploadedFileString);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Input
                type="file"
                onChange={onChange}
                inputProps={{
                    accept: "application/JSON",
                    "data-testid": "file-input",
                }}
                disableUnderline={true}
            />
            <Button
                data-testid="file-input-reapply-button"
                variant="contained"
                disabled={!uploadedFileString}
                onClick={onLoadButtonClick}
                sx={{ width: "auto", textTransform: "none" }}
            >
                Load file data
            </Button>
        </Box>
    );
}

function MemoryModelsTextInput(props: MemoryModelsTextInputPropTypes) {
    const handleTextFieldChange = (event) => {
        props.setTextData(event.target.value);
    };

    return (
        <TextField
            id="multiline-memory-models-textfield"
            data-testid="textfield-input"
            label="Enter memory model JSON here"
            multiline
            fullWidth
            rows={10}
            variant="outlined"
            value={props.textData}
            onChange={handleTextFieldChange}
            style={{
                width: "100%",
                height: "80%",
                fontFamily: "Monospace",
            }}
        />
    );
}

//TODO: Retrieve min and max seeds from memory-viz
function MemoryModelsConfigInput(props: MemoryModelsConfigInputPropTypes) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSeedChange = (event) => {
        event.preventDefault();
        props.setConfigData({
            ...props.configData,
            overallDrawConfig: {
                ...props.configData.overallDrawConfig,
                seed: Number(event.target.value),
            },
        });
    };

    const handleAutomationChange = (event) => {
        // Calling the common (among React event handlers) event.preventDefault() here
        // will cause the checkbox to require double instead of single clicks, as verified by both UI and tests.
        // Explained in https://grrr.tech/posts/2022/event-prevent-failure/#but-huh-why-does-this-work
        props.setConfigData({
            ...props.configData,
            useAutomation: event.target.checked,
        });
    };

    return (
        <>
            <Button
                onClick={handleClick}
                data-testid="rendering-options-menu"
                sx={{
                    textTransform: "none",
                    "& .MuiSvgIcon-root": {
                        transition: "transform 0.2s ease-in-out",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    },
                }}
            >
                Rendering Options
                <ExpandMoreRoundedIcon />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem>
                    <TextField
                        label="Seed"
                        id="config-seed"
                        variant="outlined"
                        value={props.configData.overallDrawConfig.seed}
                        type="number"
                        onChange={handleSeedChange}
                        InputProps={{
                            inputProps: {
                                min: 0,
                                max: 2 ** 31,
                                "data-testid": "config-seed",
                            },
                        }}
                        sx={{
                            width: "50%",
                            "& .MuiInputBase-input": { height: "10%" },
                        }}
                    />
                </MenuItem>
                <MenuItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.configData.useAutomation}
                                onChange={handleAutomationChange}
                            />
                        }
                        label="Use automatic layout"
                        sx={{ width: "50%" }}
                    />
                </MenuItem>
            </Menu>
        </>
    );
}

export default function MemoryModelsUserInput(
    props: MemoryModelsUserInputPropTypes
) {
    return (
        <form data-testid="input-form" onSubmit={props.onTextDataSubmit}>
            <MemoryModelsFileInput
                textData={props.textData}
                setTextData={props.setTextData}
                setFailureBanner={props.setFailureBanner}
                jsonResult={props.jsonResult}
            />
            <MemoryModelsConfigInput
                configData={props.configData}
                setConfigData={props.setConfigData}
            />
            <MemoryModelsTextInput
                textData={props.textData}
                setTextData={props.setTextData}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <DownloadJSONButton
                    jsonResult={props.jsonResult}
                    sx={{ width: "33.33%" }}
                />
                <Tooltip title="Input JSON to draw diagram">
                    <span>
                        <Button
                            type="submit"
                            data-testid="input-submit-button"
                            variant="contained"
                            color="primary"
                            disabled={!props.textData}
                            style={{ textTransform: "none" }}
                        >
                            Draw Diagram
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </form>
    );
}

export { MemoryModelsFileInput };
export type { configDataPropTypes };
