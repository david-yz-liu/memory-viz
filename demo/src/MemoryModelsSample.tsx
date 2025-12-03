import React, { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import MemoryModelsMenu from "./MemoryModelsMenu";

import { SAMPLES } from "./sample";

type MemoryModelsSamplePropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    setConfigData: React.Dispatch<React.SetStateAction<object>>;
    onTextDataSubmit: () => void;
};

export default function MemoryModelsSample(props: MemoryModelsSamplePropTypes) {
    const { t } = useTranslation();
    const [clickedBtnIndex, setClickedBtnIndex] = useState<number>(null);

    useEffect(() => {
        if (clickedBtnIndex !== null) {
            props.onTextDataSubmit();
        }
    }, [clickedBtnIndex]);

    const handleButtonClick = (index: number, sample: object) => {
        // Note: the following conversion to a string is inefficient, as the data is later parsed
        // back into JSON for rendering.
        // TODO: fix this.
        props.setTextData(JSON.stringify(sample["data"], null, 4));
        props.setConfigData((prevConfigData) => ({
            ...prevConfigData,
            ...sample["config"],
        }));
        setClickedBtnIndex(index);
    };

    return (
        <MemoryModelsMenu
            menuName={t("samples.title")}
            testId="sample-inputs-menu"
            menuItems={SAMPLES.map((sample, index) => (
                <MenuItem
                    key={index}
                    onClick={() => handleButtonClick(index, sample)}
                >
                    {t(sample["nameKey"])}
                </MenuItem>
            ))}
        />
    );
}
