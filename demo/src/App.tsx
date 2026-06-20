import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SvgDisplay from "./SvgDisplay.js";
import MemoryModelsUserInput from "./MemoryModelsUserInput.js";
import DownloadSVGButton from "./DownloadSVGButton.js";
import { configDataPropTypes } from "./MemoryModelsUserInput.js";
import Header from "./Header.js";

interface AppProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function App({ isDarkMode, toggleTheme }: AppProps) {
    const { t } = useTranslation();
    const [textData, setTextData] = useState("");
    const [configData, setConfigData] = useState<configDataPropTypes>({
        overallDrawConfig: {
            seed: 0,
            theme: "match",
        },
    });
    const [jsonResult, setJsonResult] = useState(null);
    const [svgResult, setSvgResult] = useState(null);
    const [failureBanner, setFailureBanner] = useState("");
    const [isValidJson, setIsValidJson] = useState(null);

    React.useEffect(() => {
        const root = document.documentElement;

        if (isValidJson === null) {
            root.style.setProperty("--icon-valid", "none", "important");
        } else {
            root.style.removeProperty("--icon-valid");
        }
    }, [isValidJson]);

    const onTextDataSubmit = (event?) => {
        event?.preventDefault();
        try {
            setJsonResult(JSON.parse(textData));
            setFailureBanner("");
            setIsValidJson(true);
        } catch (error) {
            const errorMessage = `Error parsing inputted JSON: ${error.message}`;
            console.error(errorMessage);
            setFailureBanner(errorMessage);
            setJsonResult(null);
            setIsValidJson(false);
        }
    };

    return (
        <main className="container">
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Stack direction="row" spacing={2}>
                <Box sx={{ width: "40%" }}>
                    <Typography variant="h2" color="textPrimary">
                        {t("input.title")}
                    </Typography>
                    <MemoryModelsUserInput
                        textData={textData}
                        setTextData={setTextData}
                        configData={configData}
                        setConfigData={setConfigData}
                        onTextDataSubmit={onTextDataSubmit}
                        failureBanner={failureBanner}
                        setFailureBanner={setFailureBanner}
                        isValidJson={isValidJson}
                    />
                </Box>
                <Box sx={{ width: "60%" }}>
                    <Typography variant="h2" color="textPrimary">
                        {t("output.title")}
                    </Typography>
                    <SvgDisplay
                        jsonResult={jsonResult}
                        configData={configData}
                        setSvgResult={setSvgResult}
                        setFailureBanner={setFailureBanner}
                        setIsValidJson={setIsValidJson}
                        isDarkMode={isDarkMode}
                    />
                    <DownloadSVGButton svgResult={svgResult} />
                </Box>
            </Stack>
        </main>
    );
}
