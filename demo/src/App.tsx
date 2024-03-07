import React, { useState } from "react";
import SvgDisplay from "./SvgDisplay";
import MemoryModelsUserInput from "./MemoryModels";
import { ErrorBoundary } from "react-error-boundary";
import DownloadSVGButton from "./DownloadSVGButton";
import { Alert } from "@mui/material";

export default function App() {
    const [textData, setTextData] = useState("");
    const [jsonResult, setJsonResult] = useState(null);
    const [svgResult, setSvgResult] = useState(null);
    const [failureBanner, setFailureBanner] = useState("");

    const onSubmit = (event, data) => {
        event.preventDefault();
        try {
            setJsonResult(JSON.parse(data));
            setFailureBanner("");
        } catch (error) {
            const errorMessage = `Error parsing inputted JSON: ${error.message}`;
            console.error(errorMessage);
            setFailureBanner(errorMessage);
            setJsonResult(null);
        }
    };
    const onTextDataSubmit = (event) => {
        onSubmit(event, textData);
    };

    return (
        <>
            {failureBanner && (
                <Alert severity="error" data-testid="json-parse-alert">
                    {failureBanner}
                </Alert>
            )}
            <MemoryModelsUserInput
                textData={textData}
                setTextData={setTextData}
                onTextDataSubmit={onTextDataSubmit}
                setFailureBanner={setFailureBanner}
                jsonResult={jsonResult}
            />
            <section>
                <h2>Output</h2>
                <DownloadSVGButton svgResult={svgResult} />
                <ErrorBoundary
                    fallback={
                        <p data-testid="svg-display-error-boundary">
                            This is valid JSON but not valid Memory Models JSON.
                            Please refer to the repo for more details.
                        </p>
                    }
                    key={jsonResult}
                >
                    <SvgDisplay
                        jsonResult={jsonResult}
                        setSvgResult={setSvgResult}
                    />
                </ErrorBoundary>
            </section>
        </>
    );
}
