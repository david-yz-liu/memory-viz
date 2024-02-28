import React, { useState } from "react";
import SvgDisplay from "./SvgDisplay";
import MemoryModelsUserInput from "./MemoryModels";
import { ErrorBoundary } from "react-error-boundary";
import DownloadJSONButton from "./DownloadJSONButton";
import DownloadSVGButton from "./DownloadSVGButton";
import { Alert, Stack } from "@mui/material";

export default function App() {
    const [textData, setTextData] = useState("");
    const [jsonResult, setJsonResult] = useState(null);
    const [svgResult, setSvgResult] = useState(null);
    const [showFailureBanner, setShowFailureBanner] = useState(false);

    const onSubmit = (event, data) => {
        event.preventDefault();
        try {
            setJsonResult(JSON.parse(data));
            setShowFailureBanner(false);
        } catch (error) {
            console.error(`Error parsing inputted JSON: ${error.message}`);
            setShowFailureBanner(true);
            setJsonResult(null);
            setSvgResult(null);
        }
    };
    const onTextDataSubmit = (event) => {
        onSubmit(event, textData);
    };

    return (
        <>
            {showFailureBanner && (
                <Alert severity="error" data-testid="json-parse-alert">
                    Failed to parse JSON. Please input valid JSON and re-draw
                    diagram
                </Alert>
            )}
            <MemoryModelsUserInput
                textData={textData}
                setTextData={setTextData}
                onTextDataSubmit={onTextDataSubmit}
            />
            <section>
                <h2>Output</h2>
                <ErrorBoundary
                    fallback={
                        <div data-testid="svg-display-error-boundary">
                            This is valid JSON but not valid Memory Models JSON.
                            Please refer to the repo for more details.
                        </div>
                    }
                    key={jsonResult}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                    >
                        <DownloadJSONButton jsonResult={jsonResult} />
                        <DownloadSVGButton svgResult={svgResult} />
                    </Stack>
                    <SvgDisplay
                        jsonResult={jsonResult}
                        setSvgResult={setSvgResult}
                    />
                </ErrorBoundary>
            </section>
        </>
    );
}
