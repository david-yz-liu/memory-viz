import React from "react";
import { Button } from "@mui/material";

type DownloadJSONButtonPropTypes = {
    jsonResult: string;
    sx: object;
};
export default function DownloadJSONButton(props: DownloadJSONButtonPropTypes) {
    const file = new Blob([JSON.stringify(props.jsonResult, null, 2)], {
        type: "application/JSON",
    });

    return (
        <Button
            variant="contained"
            color="primary"
            data-testid="download-json-btn"
            disabled={!props.jsonResult}
            download="memory_model.json"
            target="_blank"
            rel="noreferrer"
            href={window.URL.createObjectURL(file)}
            sx={{ ...props.sx }}
        >
            Download This JSON
        </Button>
    );
}
