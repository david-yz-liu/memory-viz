import React from "react";
import { Box, Button, Link, Input, Typography, TextField } from "@mui/material";
import SampleInputMenu from "./SampleInputMenu";

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
        onTextDataSubmit: () => void;
    };

export default function UserInput(props: MemoryModelsUserInputPropTypes) {
    const classes = {
        inputBox: {
            display: "flex",
            flexDirection: "column",
        },
        title: {
            fontWeight: "600",
            mb: "1rem",
        },
        button1: {
            width: "auto",
            textTransform: "none",
        },
        fileInputBox: {
            display: "flex",
            justifyContent: "space-between",
        },
        textField: {
            height: "auto",
            "& .MuiInputBase-input": {
                fontFamily: "Consolas, monospace",
                background: "none !important",
            },
        },
        inputBottomBox: {
            display: "flex",
            justifyContent: "space-between",
        },
        input: {
            width: "50%",
        },
    };

    const onChange = (event) => {
        try {
            const uploadedFile = event.target.files[0];
            const fileReader = new global.FileReader();
            fileReader.readAsText(uploadedFile, "UTF-8");
            fileReader.onload = (event) => {
                const fileString = event.target.result as string;
                props.setTextData(fileString);
            };
        } catch (error) {
            const errorMessage = `Error reading uploaded file as text. Please ensure it's in UTF-8 encoding: ${error.message}`;
            console.error(errorMessage);
            props.setTextData(null);
            props.setFailureBanner(errorMessage);
        }
    };

    const file = new Blob([JSON.stringify(props.jsonResult, null, 2)], {
        type: "application/JSON",
    });

    const handleTextFieldChange = (event) => {
        props.setTextData(event.target.value);
    };

    return (
        <Box sx={classes.inputBox}>
            <Typography variant="h5" sx={classes.title}>
                Input
            </Typography>
            <Box sx={classes.fileInputBox}>
                <Input
                    type="file"
                    onChange={onChange}
                    inputProps={{
                        accept: "application/JSON",
                        "data-testid": "file-input",
                    }}
                    disableUnderline={true}
                    sx={classes.input}
                />
                <SampleInputMenu
                    setTextData={props.setTextData}
                    setConfigData={props.setConfigData}
                    onTextDataSubmit={props.onTextDataSubmit}
                />
            </Box>

            <TextField
                label="Enter memory model JSON here"
                variant="outlined"
                multiline
                fullWidth
                rows={10}
                value={props.textData}
                onChange={handleTextFieldChange}
                sx={classes.textField}
            />
            <Box sx={classes.inputBottomBox}>
                <Link
                    target="_blank"
                    rel="noreferrer"
                    href={window.URL.createObjectURL(file)}
                    download="memory_model.json"
                >
                    Download JSON
                </Link>
                <Button
                    onClick={props.onTextDataSubmit}
                    variant="contained"
                    disabled={!props.textData}
                    sx={classes.button1}
                >
                    Draw Diagram
                </Button>
            </Box>
        </Box>
    );
}
