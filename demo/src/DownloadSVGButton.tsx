import React from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

type DownloadSVGButtonPropTypes = {
    svgResult: string;
};
export default function DownloadSVGButton(props: DownloadSVGButtonPropTypes) {
    const handleDownload = () => {
        const file = new global.Blob([props.svgResult], {
            type: "image/svg+xml",
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = "output.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            color="primary"
            variant="text"
            data-testid="download-svg-btn"
            disabled={!props.svgResult}
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            sx={{ textTransform: "none" }}
        >
            Download SVG
        </Button>
    );
}
