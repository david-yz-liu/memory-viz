import React from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@mui/icons-material/Download";

type DownloadJSONButtonPropTypes = {
    textData: string;
};
export default function DownloadJSONButton(props: DownloadJSONButtonPropTypes) {
    const { t } = useTranslation();
    const file = new Blob([props.textData], {
        type: "application/JSON",
    });

    return (
        <Button
            variant="contained"
            color="primary"
            data-testid="download-json-btn"
            disabled={!props.textData}
            download="memory_model.json"
            target="_blank"
            rel="noreferrer"
            href={window.URL.createObjectURL(file)}
            startIcon={<DownloadIcon />}
            sx={{ textTransform: "none" }}
        >
            {t("input.downloadJSON")}
        </Button>
    );
}
