import React, { useState } from "react";
import SvgDisplay from "./SvgDisplay";
import MemoryModelsTab from "./MemoryModels";
import { ErrorBoundary } from "react-error-boundary";
import DownloadJSONButton from "./DownloadJSONButton";
import DownloadSVGButton from "./DownloadSVGButton";
import { Container, CssBaseline, Stack } from "@mui/material";

export default function App() {
    const [textData, setTextData] = useState("");
    const [fileData, setFileData] = useState("");
    const [jsonResult, setJsonResult] = useState(null);
    const [svgResult, setSvgResult] = useState(null);

    const onSubmit = (event, data) => {
        event.preventDefault();
        try {
            setJsonResult(JSON.parse(data));
        } catch (error) {
            console.error(`Error parsing inputted JSON: ${error.message}`);
            setJsonResult(null);
        }
    };
    const onTextDataSubmit = (event) => {
        onSubmit(event, textData);
    };

    const onFileDataSubmit = (event) => {
        onSubmit(event, fileData);
    };

    // TODO: Container not taking up all space, more like 50%
    return (
        <>
            <MemoryModelsTab
                textData={textData}
                setTextData={setTextData}
                onTextDataSubmit={onTextDataSubmit}
                fileData={fileData}
                setFileData={setFileData}
                onFileDataSubmit={onFileDataSubmit}
            />
            <section>
                <h2>Output</h2>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                >
                    {jsonResult && (
                        <DownloadJSONButton jsonResult={jsonResult} />
                    )}
                    {svgResult && <DownloadSVGButton svgResult={svgResult} />}
                </Stack>
                <ErrorBoundary
                    fallback={
                        <div data-testid="svg-display-error-boundary">
                            Something went wrong
                        </div>
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
