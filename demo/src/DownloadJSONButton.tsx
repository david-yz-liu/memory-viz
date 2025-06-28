import React from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

type DownloadJSONButtonPropTypes = {
    textData: string;
};
export default function DownloadJSONButton(props: DownloadJSONButtonPropTypes) {
    const handleDownload = () => {
        const file = new Blob([props.textData], {
            type: "application/JSON",
        });
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = "memory_model.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="text"
            color="primary"
            data-testid="download-json-btn"
            disabled={!props.textData}
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            sx={{ textTransform: "none" }}
        >
            Download JSON
        </Button>
    );
}
