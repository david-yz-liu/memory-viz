import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Input,
    TextField,
    MenuItem,
    Stack,
    Dialog,
    DialogActions,
    DialogContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DownloadJSONButton from "./DownloadJSONButton.js";
import MemoryModelsMenu from "./MemoryModelsMenu.js";
import MemoryModelsSample from "./MemoryModelsSample.js";

interface configDataPropTypes {
    overallDrawConfig: {
        [key: string]: any;
    };
}

type MemoryModelsConfigInputPropTypes = {
    configData: configDataPropTypes;
    setConfigData: React.Dispatch<React.SetStateAction<object>>;
};

type MemoryModelsFileInputPropTypes = {
    onInputChange: (textData: string, config?: configDataPropTypes) => void;
    textData: string;
    setFailureBanner: React.Dispatch<React.SetStateAction<string>>;
};

type MemoryModelsTextInputPropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    textData: string;
    isValidJson?: boolean;
};

type MemoryModelsUserInputPropTypes = MemoryModelsFileInputPropTypes &
    MemoryModelsTextInputPropTypes &
    MemoryModelsConfigInputPropTypes & {
        failureBanner: string;
    };

function MemoryModelsFileInput(props: MemoryModelsFileInputPropTypes) {
    const { t } = useTranslation();
    const [uploadedFileString, setUploadedFileString] = useState("");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setUploadedFileString("");
    };

    const onChange = (event) => {
        try {
            const uploadedFile = event.target.files[0];
            const fileReader = new global.FileReader();
            fileReader.readAsText(uploadedFile, "UTF-8");
            fileReader.onload = (event) => {
                const fileString = event.target.result as string;
                setUploadedFileString(fileString);
            };
        } catch (error) {
            const errorMessage = `${t("errors.fileReading")} ${error.message}`;
            console.error(errorMessage);
        }
    };

    const onLoadButtonClick = () => {
        setOpen(false);
        props.onInputChange(uploadedFileString);
    };

    return (
        <div>
            <Button
                onClick={handleOpen}
                startIcon={<UploadFileIcon />}
                sx={{ textTransform: "none" }}
            >
                {t("input.uploadButton")}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                data-testid="file-input-dialog"
            >
                <DialogContent>
                    <Input
                        type="file"
                        onChange={onChange}
                        inputProps={{
                            accept: "application/JSON",
                            "data-testid": "file-input",
                        }}
                        disableUnderline={true}
                        sx={{ alignSelf: "center" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        data-testid="file-input-reapply-button"
                        variant="contained"
                        color="primary"
                        disabled={!uploadedFileString}
                        onClick={onLoadButtonClick}
                        sx={{ textTransform: "none" }}
                        startIcon={<FolderOpenIcon />}
                    >
                        {t("input.loadFileData")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function MemoryModelsTextInput(props: MemoryModelsTextInputPropTypes) {
    const { t } = useTranslation();
    const handleTextFieldChange = (event) => {
        props.setTextData(event.target.value);
    };

    return (
        <TextField
            id="multiline-memory-models-textfield"
            data-testid="textfield-input"
            label={t("input.textFieldLabel")}
            multiline
            fullWidth
            rows={10}
            variant="outlined"
            value={props.textData}
            onChange={handleTextFieldChange}
            error={props.isValidJson === false}
            slotProps={{
                input: {
                    style: { fontFamily: "monospace" },
                },
                htmlInput: {
                    wrap: "off",
                },
            }}
        />
    );
}

//TODO: Retrieve min and max seeds from memory-viz
function MemoryModelsConfigInput(props: MemoryModelsConfigInputPropTypes) {
    const { t } = useTranslation();
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

    const handleThemeChange = (event) => {
        props.setConfigData({
            ...props.configData,
            overallDrawConfig: {
                ...props.configData.overallDrawConfig,
                theme: event.target.value,
            },
        });
    };

    return (
        <MemoryModelsMenu
            menuName={t("rendering.title")}
            testId="rendering-options-menu"
            menuItems={
                <>
                    <MenuItem>
                        <TextField
                            label={t("rendering.seed")}
                            id="config-seed"
                            variant="outlined"
                            defaultValue={
                                props.configData.overallDrawConfig.seed
                            }
                            type="number"
                            onBlur={handleSeedChange}
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    max: 2 ** 31,
                                    "data-testid": "config-seed",
                                },
                            }}
                        />
                    </MenuItem>
                    <MenuItem>
                        <TextField
                            select
                            label={t("rendering.theme")}
                            value={
                                props.configData.overallDrawConfig.theme ??
                                "match"
                            }
                            onChange={handleThemeChange}
                            fullWidth
                        >
                            <MenuItem value="match">
                                {t("rendering.matchWebsite")}
                            </MenuItem>
                            <MenuItem value="light">
                                {t("rendering.light")}
                            </MenuItem>
                            <MenuItem value="dark">
                                {t("rendering.dark")}
                            </MenuItem>
                        </TextField>
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
        <form data-testid="input-form">
            <Stack spacing={2}>
                <MemoryModelsFileInput
                    textData={props.textData}
                    setFailureBanner={props.setFailureBanner}
                    onInputChange={props.onInputChange}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        overflow: "hidden",
                        minWidth: 0,
                    }}
                >
                    <MemoryModelsSample onInputChange={props.onInputChange} />
                    <MemoryModelsConfigInput
                        configData={props.configData}
                        setConfigData={props.setConfigData}
                    />
                </Box>
                <MemoryModelsTextInput
                    textData={props.textData}
                    setTextData={props.setTextData}
                    isValidJson={props.isValidJson}
                />
                {props.failureBanner && (
                    <Alert
                        severity="error"
                        data-testid="failure-banner"
                        sx={{ whiteSpace: "pre-wrap" }}
                    >
                        {props.failureBanner}
                    </Alert>
                )}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: "space-between" }}
                >
                    <DownloadJSONButton textData={props.textData} />
                </Stack>
            </Stack>
        </form>
    );
}

export { MemoryModelsFileInput };
export type { configDataPropTypes };
