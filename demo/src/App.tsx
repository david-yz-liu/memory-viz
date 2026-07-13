import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import SvgDisplay from "./SvgDisplay.js";
import MemoryModelsUserInput from "./MemoryModelsUserInput.js";
import DownloadSVGButton from "./DownloadSVGButton.js";
import type { configDataPropTypes } from "./MemoryModelsUserInput.js";
import Header from "./Header.js";

const TEXT_INPUT_DEBOUNCE_DELAY = 1000;

interface AppProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function App({ isDarkMode, toggleTheme }: AppProps) {
    const { t } = useTranslation();
    const [textData, setTextData] = useState("");
    const [debouncedTextData, debouncedControls] = useDebounce(
        textData,
        TEXT_INPUT_DEBOUNCE_DELAY
    );
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

    React.useEffect(() => {
        if (debouncedTextData == "") {
            setJsonResult(null);
            setFailureBanner("");
            setIsValidJson(null);
        } else {
            try {
                setJsonResult(JSON.parse(debouncedTextData));
                setFailureBanner("");
                setIsValidJson(true);
            } catch (error) {
                const errorMessage = `Error parsing inputted JSON: ${error.message}`;
                console.error(errorMessage);
                setJsonResult(null);
                setFailureBanner(errorMessage);
                setIsValidJson(false);
            }
        }
    }, [debouncedTextData]);

    const onInputChange = (textData: string, config?: configDataPropTypes) => {
        if (config) {
            setConfigData((prevConfigData) => ({
                ...prevConfigData,
                ...config,
                overallDrawConfig: {
                    ...prevConfigData?.overallDrawConfig,
                    ...config?.overallDrawConfig,
                },
            }));
        }
        setTextData(textData);
        debouncedControls(textData);
        debouncedControls.flush();
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
                        failureBanner={failureBanner}
                        setFailureBanner={setFailureBanner}
                        isValidJson={isValidJson}
                        onInputChange={onInputChange}
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
