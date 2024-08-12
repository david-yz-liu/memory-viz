import React, { useState } from "react";
import { configDataPropTypes } from "./UserInput";
import UserInput from "./UserInput";
import Header from "./Header";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import UserOutput from "./UserOutput";

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
                    gap: "2rem",
                }}
            >
                <Box sx={{ width: "40%" }}>
                    <UserInput
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
                    <UserOutput
                        jsonResult={jsonResult}
                        configData={configData}
                        setConfigData={setConfigData}
                        svgResult={svgResult}
                        setSvgResult={setSvgResult}
                    />
                </Box>
            </Box>
        </>
    );
}
