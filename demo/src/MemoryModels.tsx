import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Input,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

type MemoryModelsFileInputPropTypes = {
    setFileData: React.Dispatch<React.SetStateAction<string>>;
    setTextData: React.Dispatch<React.SetStateAction<string>>;
};
type MemoryModelsTextInputPropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    textData: string;
};
type MemoryModelsTabPropTypes = MemoryModelsFileInputPropTypes &
    MemoryModelsTextInputPropTypes & {
        fileData: string;
        onFileDataSubmit: (event: React.MouseEvent<HTMLFormElement>) => void;
        onTextDataSubmit: (event: React.MouseEvent<HTMLFormElement>) => void;
    };

function MemoryModelsFileInput(props: MemoryModelsFileInputPropTypes) {
    const onChange = (event) => {
        // TODO: pop up dialog asking user if they're sure to overwrite (any) existing text data
        const uploadedFile = event.target.files[0];
        const fileReader = new FileReader();

        try {
            fileReader.readAsText(uploadedFile, "UTF-8");
            fileReader.onload = (event) => {
                props.setFileData(uploadedFile.name);
                console.log(uploadedFile.name);
                props.setTextData(event.target.result as string);
            };
        } catch (error) {
            console.error(
                `Error parsing uploaded File as JSON: ${error.message}`
            );
            props.setFileData(null);
            props.setTextData(null);
        }
    };

    return (
        <CardContent>
            <Input
                type="file"
                onChange={onChange}
                inputProps={{ accept: "application/JSON" }}
                sx={{ width: "100%", height: "20%" }}
                disableUnderline={true}
            />
        </CardContent>
    );
}

function MemoryModelsTextInput(props: MemoryModelsTextInputPropTypes) {
    const handleTextFieldChange = (event) => {
        props.setTextData(event.target.value);
    };

    return (
        <CardContent>
            <TextField
                id="multiline-textfield"
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
        </CardContent>
    );
}

export default function MemoryModelsTab(props: MemoryModelsTabPropTypes) {
    return (
        <form data-testid="input-form" onSubmit={props.onTextDataSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card sx={{ height: "400px", overflow: "auto" }}>
                        <Typography component="div">
                            <MemoryModelsFileInput
                                setFileData={props.setFileData}
                                setTextData={props.setTextData}
                            />
                            <MemoryModelsTextInput
                                textData={props.textData}
                                setTextData={props.setTextData}
                            />
                        </Typography>
                    </Card>
                    <Tooltip title="Input some text or upload a JSON file to draw diagram">
                        <span>
                            <Button
                                type="submit"
                                data-testid="input-submit-button"
                                variant="contained"
                                color="primary"
                                disabled={!props.textData}
                                style={{ fontFamily: "Monospace" }}
                            >
                                Draw Diagram
                            </Button>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
        </form>
    );
}
