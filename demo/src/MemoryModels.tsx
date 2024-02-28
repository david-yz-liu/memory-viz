import React, { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Grid,
    Input,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

type MemoryModelsInputPropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    textData: string;
};
type MemoryModelsUserInputPropTypes = MemoryModelsInputPropTypes & {
    onTextDataSubmit: (event: React.MouseEvent<HTMLFormElement>) => void;
};

function MemoryModelsFileInput(props: MemoryModelsInputPropTypes) {
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
            console.error(
                `Error parsing uploaded File as JSON: ${error.message}`
            );
            props.setTextData(null);
        }
    };

    const onReapplyBtnClick = () => {
        props.setTextData(uploadedFileString);
    };

    return (
        <CardContent>
            <Input
                type="file"
                onChange={onChange}
                inputProps={{
                    accept: "application/JSON",
                    "data-testid": "file-input",
                }}
                sx={{ width: "100%", input: { color: "primary" } }}
                disableUnderline={true}
            />
            <Button
                data-testid="file-input-reapply-button"
                variant="contained"
                color="primary"
                disabled={!uploadedFileString}
                style={{ fontFamily: "Monospace", textTransform: "none" }}
                onClick={onReapplyBtnClick}
            >
                (Re)Apply file input to text box
            </Button>
        </CardContent>
    );
}

function MemoryModelsTextInput(props: MemoryModelsInputPropTypes) {
    const handleTextFieldChange = (event) => {
        props.setTextData(event.target.value);
    };

    return (
        <CardContent>
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
        </CardContent>
    );
}

export default function MemoryModelsUserInput(
    props: MemoryModelsUserInputPropTypes
) {
    return (
        <form data-testid="input-form" onSubmit={props.onTextDataSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <Typography component="div">
                            <MemoryModelsFileInput
                                textData={props.textData}
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

export { MemoryModelsFileInput };
