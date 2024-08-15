import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import SvgDisplay from "./SvgDisplay";
import MemoryModelsUserInput from "./MemoryModelsUserInput";
import { ErrorBoundary } from "react-error-boundary";
import DownloadSVGButton from "./DownloadSVGButton";
import { Alert } from "@mui/material";
import { configDataPropTypes } from "./MemoryModelsUserInput";
import Header from "./Header";

export default function App() {
    const [textData, setTextData] = useState("");
    const [configData, setConfigData] = useState<configDataPropTypes>({
        useAutomation: true,
        overallDrawConfig: {
            seed: 0,
        },
    });
    const [jsonResult, setJsonResult] = useState(null);
    const [svgResult, setSvgResult] = useState(null);
    const [failureBanner, setFailureBanner] = useState("");

    const onTextDataSubmit = (event?) => {
        event?.preventDefault();
        try {
            setJsonResult(JSON.parse(textData));
            setFailureBanner("");
        } catch (error) {
            const errorMessage = `Error parsing inputted JSON: ${error.message}`;
            console.error(errorMessage);
            setFailureBanner(errorMessage);
            setJsonResult(null);
        }
    };

    return (
        <>
            <Header />
            {failureBanner && (
                <Alert severity="error" data-testid="json-parse-alert">
                    {failureBanner}
                </Alert>
            )}
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <h2>Input</h2>
                    <MemoryModelsUserInput
                        textData={textData}
                        setTextData={setTextData}
                        configData={configData}
                        setConfigData={setConfigData}
                        onTextDataSubmit={onTextDataSubmit}
                        setFailureBanner={setFailureBanner}
                        jsonResult={jsonResult}
                    />
                </Box>
                <Box sx={{ width: "60%" }}>
                    <h2>Output</h2>
                    <ErrorBoundary
                        fallback={
                            <p data-testid="svg-display-error-boundary">
                                This is valid JSON but not valid Memory Models
                                JSON. Please refer to the repo for more details.
                            </p>
                        }
                        key={jsonResult}
                    >
                        <SvgDisplay
                            jsonResult={jsonResult}
                            configData={configData}
                            setSvgResult={setSvgResult}
                        />
                    </ErrorBoundary>
                    <DownloadSVGButton svgResult={svgResult} />
                </Box>
            </Stack>
        </>
    );
}
