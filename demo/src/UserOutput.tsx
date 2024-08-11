import React from "react";
import SvgDisplay from "./SvgDisplay";
import { configDataPropTypes } from "./UserInput";
import {
    Box,
    Typography,
    Link,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

type OutputPropTypes = {
    jsonResult: object | null;
    configData: configDataPropTypes;
    setConfigData: React.Dispatch<React.SetStateAction<configDataPropTypes>>;
    svgResult: string;
    setSvgResult: React.Dispatch<React.SetStateAction<string>>;
};

export default function Output(props: OutputPropTypes) {
    const file = new global.Blob([props.svgResult], { type: "image/svg+xml" });

    const handleSeedChange = (event) => {
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
            <Typography variant="h5" sx={{ fontWeight: "600", mb: "1rem" }}>
                Output
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    marginBottom: 1.3,
                }}
            >
                <TextField
                    id="seed"
                    label="Seed"
                    variant="standard"
                    sx={{ width: 200, "& .MuiInputBase-input": { height: 15 } }}
                    value={props.configData.overallDrawConfig.seed}
                    onChange={handleSeedChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={props.configData.useAutomation}
                            onChange={handleAutomationChange}
                        />
                    }
                    label="Use automatic layout"
                    sx={{ marginLeft: 15 }}
                />
            </Box>
            <SvgDisplay
                jsonResult={props.jsonResult}
                configData={props.configData}
                setSvgResult={props.setSvgResult}
            />
            <Link
                download="output.svg"
                underline="always"
                href={URL.createObjectURL(file)}
            >
                {"Download SVG"}
            </Link>
        </>
    );
}
