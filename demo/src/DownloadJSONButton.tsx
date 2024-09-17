import React from "react";
import { Button } from "@mui/material";

type DownloadJSONButtonPropTypes = {
    jsonResult: string;
    disable: boolean;
};
export default function DownloadJSONButton(props: DownloadJSONButtonPropTypes) {
    const file = new Blob([JSON.stringify(props.jsonResult, null, 2)], {
        type: "application/JSON",
    });

    return (
        <Button
            variant="text"
            color="primary"
            data-testid="download-json-btn"
            disabled={props.disable}
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
