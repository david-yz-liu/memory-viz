import React from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@mui/icons-material/Download";

type DownloadSVGButtonPropTypes = {
    svgResult: string;
};
export default function DownloadSVGButton(props: DownloadSVGButtonPropTypes) {
    const { t } = useTranslation();
    const file = new global.Blob([props.svgResult], { type: "image/svg+xml" });

    return (
        <Button
            color="primary"
            variant="contained"
            data-testid="download-svg-btn"
            disabled={!props.svgResult}
            href={URL.createObjectURL(file)}
            target="_blank"
            rel="noreferrer"
            download="output.svg"
            startIcon={<DownloadIcon />}
            sx={{ textTransform: "none" }}
        >
            {t("output.downloadSVG")}
        </Button>
    );
}
