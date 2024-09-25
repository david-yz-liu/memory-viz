import React from "react";
import { Button } from "@mui/material";

type DownloadJSONButtonPropTypes = {
    textData: string;
};
export default function DownloadJSONButton(props: DownloadJSONButtonPropTypes) {
    const file = new Blob([props.textData], {
        type: "application/JSON",
    });

    return (
        <Button
            variant="text"
            color="primary"
            data-testid="download-json-btn"
            disabled={!props.textData}
            download="memory_model.json"
            target="_blank"
            rel="noreferrer"
            href={window.URL.createObjectURL(file)}
            sx={{ textTransform: "none" }}
        >
            Download JSON
        </Button>
    );
}
