import React from "react";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import MemoryModelsMenu from "./MemoryModelsMenu.js";
import type { configDataPropTypes } from "./MemoryModelsUserInput.jsx";

import { SAMPLES } from "./sample/index.js";

type MemoryModelsSamplePropTypes = {
    onInputChange: (textData: string, config?: configDataPropTypes) => void;
};

export default function MemoryModelsSample(props: MemoryModelsSamplePropTypes) {
    const { t } = useTranslation();

    const handleButtonClick = (sample: object) => {
        // Note: the following conversion to a string is inefficient, as the data is later parsed
        // back into JSON for rendering.
        // TODO: fix this.
        const sampleTextData = JSON.stringify(sample["data"], null, 4);
        props.onInputChange(sampleTextData, sample["config"]);
    };

    return (
        <MemoryModelsMenu
            menuName={t("samples.title")}
            testId="sample-inputs-menu"
            menuItems={SAMPLES.map((sample, index) => (
                <MenuItem
                    key={index}
                    tabIndex={0}
                    onClick={() => handleButtonClick(sample)}
                >
                    {t(sample["nameKey"])}
                </MenuItem>
            ))}
        />
    );
}
