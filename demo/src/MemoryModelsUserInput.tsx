import React, { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Input,
    TextField,
    Tooltip,
    MenuItem,
    Stack,
} from "@mui/material";
import DownloadJSONButton from "./DownloadJSONButton";
import MemoryModelsMenu from "./MemoryModelsMenu";
import MemoryModelsSample from "./MemoryModelsSample";

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
        onTextDataSubmit: (event?: React.MouseEvent<HTMLFormElement>) => void;
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
        <Stack direction={"row"} spacing={2}>
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
                sx={{ textTransform: "none" }}
            >
                Load file data
            </Button>
        </Stack>
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
        />
    );
}

//TODO: Retrieve min and max seeds from memory-viz
function MemoryModelsConfigInput(props: MemoryModelsConfigInputPropTypes) {
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
        <MemoryModelsMenu
            menuName="Rendering Options"
            testId="rendering-options-menu"
            menuItems={
                <>
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
                        />
                    </MenuItem>
                </>
            }
        />
    );
}

export default function MemoryModelsUserInput(
    props: MemoryModelsUserInputPropTypes
) {
    return (
        <form data-testid="input-form" onSubmit={props.onTextDataSubmit}>
            <Stack spacing={2}>
                <MemoryModelsFileInput
                    textData={props.textData}
                    setTextData={props.setTextData}
                    setFailureBanner={props.setFailureBanner}
                    jsonResult={props.jsonResult}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <MemoryModelsSample
                        setTextData={props.setTextData}
                        setConfigData={props.setConfigData}
                        onTextDataSubmit={props.onTextDataSubmit}
                    />
                    <MemoryModelsConfigInput
                        configData={props.configData}
                        setConfigData={props.setConfigData}
                    />
                </Box>
                <MemoryModelsTextInput
                    textData={props.textData}
                    setTextData={props.setTextData}
                />
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: "space-between" }}
                >
                    <DownloadJSONButton jsonResult={props.jsonResult} />
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
                </Stack>
            </Stack>
        </form>
    );
}

export { MemoryModelsFileInput };
export type { configDataPropTypes };
