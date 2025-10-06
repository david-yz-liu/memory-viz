import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import SvgDisplay from "./SvgDisplay";
import MemoryModelsUserInput from "./MemoryModelsUserInput";
import { ErrorBoundary } from "react-error-boundary";
import DownloadSVGButton from "./DownloadSVGButton";
import { Alert } from "@mui/material";
import { configDataPropTypes } from "./MemoryModelsUserInput";
import Header from "./Header";

interface AppProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function App({ isDarkMode, toggleTheme }: AppProps) {
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
        <main className="container">
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            {failureBanner && (
                <Alert severity="error" data-testid="json-parse-alert">
                    {failureBanner}
                </Alert>
            )}
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <Typography variant="h2" color="textPrimary">
                        Input
                    </Typography>
                    <MemoryModelsUserInput
                        textData={textData}
                        setTextData={setTextData}
                        configData={configData}
                        setConfigData={setConfigData}
                        onTextDataSubmit={onTextDataSubmit}
                        setFailureBanner={setFailureBanner}
                    />
                </Box>
                <Box sx={{ width: "60%" }}>
                    <Typography variant="h2" color="textPrimary">
                        Output
                    </Typography>
                    <ErrorBoundary
                        fallbackRender={({ error }) => (
                            <Alert
                                severity="error"
                                data-testid="svg-display-error-boundary"
                                style={{ whiteSpace: "pre-wrap" }} // ensures newlines show
                            >
                                {error.message}
                            </Alert>
                        )}
                        resetKeys={[jsonResult]}
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
        </main>
    );
}
