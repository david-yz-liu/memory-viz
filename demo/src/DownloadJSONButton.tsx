import React from "react";
import { Button } from "@mui/material";

type DownloadJSONButtonPropTypes = {
    jsonResult: string;
};
export default function DownloadJSONButton(props: DownloadJSONButtonPropTypes) {
    const file = new Blob([JSON.stringify(props.jsonResult, null, 2)], {
        type: "application/JSON",
    });

    //TODO: pop up a dialogue asking if they want to 1) overwrite the uploaded file (and reuse the filename) or
    // 2) download as a separate file (with a new filename)
    return (
        <Button
            variant="contained"
            color="primary"
            style={{ fontFamily: "Monospace" }}
            download="input.json"
            target="_blank"
            rel="noreferrer"
            href={URL.createObjectURL(file)}
        >
            Download JSON
        </Button>
    );
}
