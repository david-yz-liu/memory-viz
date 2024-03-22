import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    Input,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import DownloadJSONButton from "./DownloadJSONButton";
import { ExpandMore } from "@mui/icons-material";

interface configDataPropTypes {
    useAutomation: boolean;
    overallDrawConfig: {
        seed: Number;
    };
    individualDrawConfig: Array<any>;
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
        <CardContent>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
            >
                <Input
                    type="file"
                    onChange={onChange}
                    inputProps={{
                        accept: "application/JSON",
                        "data-testid": "file-input",
                    }}
                    sx={{ width: "33.33%" }}
                    disableUnderline={true}
                />
                <Button
                    data-testid="file-input-reapply-button"
                    variant="contained"
                    disabled={!uploadedFileString}
                    onClick={onLoadButtonClick}
                    sx={{ width: "33.33%", textTransform: "none" }}
                >
                    Load file data
                </Button>
                <DownloadJSONButton
                    jsonResult={props.jsonResult}
                    sx={{ width: "33.33%" }}
                />
            </Stack>
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
//TODO:
// Retrieve min and max seeds from the backend
function MemoryModelsConfigInput(props) {
    const [seed, setSeed] = useState("");
    const [useAutomation, setUseAutomation] = useState(true);

    useEffect(() => {
        props.setConfigData((prevConfig) => ({
            ...prevConfig,
            overallDrawConfig: {
                seed: seed,
                useAutomation: useAutomation,
            },
        }));
    }, []);

    const handleSeedChange = (event) => {
        event.preventDefault();
        const inputSeed = event.target.value;
        setSeed(inputSeed);
        props.setConfigData((prevConfig) => ({
            ...prevConfig,
            overallDrawConfig: {
                ...prevConfig.overallDrawConfig,
                seed: Number(inputSeed),
            },
        }));
    };

    const handleAutomationChange = (event) => {
        event.preventDefault();
        setUseAutomation(event.target.checked);
        props.setConfigData((prevConfig) => ({
            ...prevConfig,
            useAutomation: event.target.checked,
        }));
    };

    return (
        <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                    label="Seed"
                    id="config-seed"
                    variant="outlined"
                    value={seed}
                    onChange={handleSeedChange}
                    type="number"
                    InputProps={{
                        inputProps: { min: 0, max: 2 ** 31 },
                    }}
                    sx={{ width: "50%" }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={useAutomation}
                            onChange={handleAutomationChange}
                        />
                    }
                    label="Generate with automation"
                    sx={{ width: "50%" }}
                />
            </Stack>
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
                    <Card color="neutral">
                        <MemoryModelsFileInput
                            textData={props.textData}
                            setTextData={props.setTextData}
                            setFailureBanner={props.setFailureBanner}
                            jsonResult={props.jsonResult}
                        />
                        <MemoryModelsTextInput
                            textData={props.textData}
                            setTextData={props.setTextData}
                        />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                id="optional-styles-accordion"
                            >
                                Optional Styling
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card color="neutral" variant="outlined">
                                    <MemoryModelsConfigInput
                                        configData={props.configData}
                                        setConfigData={props.setConfigData}
                                    />
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                    </Card>
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
                </Grid>
            </Grid>
        </form>
    );
}

export { MemoryModelsFileInput };
export type { configDataPropTypes };
