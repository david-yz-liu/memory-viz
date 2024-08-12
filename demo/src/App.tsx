import React, { useState } from "react";
import SvgDisplay from "./SvgDisplay";
import MemoryModelsUserInput from "./MemoryModelsUserInput";
import { ErrorBoundary } from "react-error-boundary";
import DownloadSVGButton from "./DownloadSVGButton";
import { Alert } from "@mui/material";
import { configDataPropTypes } from "./MemoryModelsUserInput";
import MemoryModelsSample from "./MemoryModelsSample";
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
            <MemoryModelsSample
                setTextData={setTextData}
                setConfigData={setConfigData}
                onTextDataSubmit={onTextDataSubmit}
            />
            <MemoryModelsUserInput
                textData={textData}
                setTextData={setTextData}
                configData={configData}
                setConfigData={setConfigData}
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
                        configData={configData}
                        setSvgResult={setSvgResult}
                    />
                </ErrorBoundary>
            </section>
        </>
    );
}
