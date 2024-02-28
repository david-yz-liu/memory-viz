import React from "react";
import { Button } from "@mui/material";

type DownloadJSONButtonPropTypes = {
    jsonResult: string;
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
            style={{ fontFamily: "Monospace" }}
            disabled={!props.jsonResult}
            download="input.json"
            target="_blank"
            rel="noreferrer"
            href={window.URL.createObjectURL(file)}
        >
            Download This JSON
        </Button>
    );
}
