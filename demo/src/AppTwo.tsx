import React, { useState } from "react";
import { configDataPropTypes } from "./MemoryModelsUserInput";
import UserInput from "./UserInput";
import Header from "./Header";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import DownloadSVGButton from "./DownloadSVGButton";
import SvgDisplay from "./SvgDisplay";

export default function AppTwo() {
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
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <UserInput
                    textData={textData}
                    setTextData={setTextData}
                    configData={configData}
                    setConfigData={setConfigData}
                    onTextDataSubmit={onTextDataSubmit}
                    setFailureBanner={setFailureBanner}
                    jsonResult={jsonResult}
                />
                <Box sx={{ width: "60%" }}>
                    <h2>Output</h2>
                    <DownloadSVGButton svgResult={svgResult} />
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
                    {/* Put your component here! (And feel free to get rid of the border) */}
                </Box>
            </Box>
        </>
    );
}
