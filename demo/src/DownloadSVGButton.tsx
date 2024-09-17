import React from "react";
import { Button } from "@mui/material";

type DownloadSVGButtonPropTypes = {
    svgResult: string;
    disabled: boolean;
};
export default function DownloadSVGButton(props: DownloadSVGButtonPropTypes) {
    const file = new global.Blob([props.svgResult], { type: "image/svg+xml" });

    return (
        <Button
            color="primary"
            variant="text"
            data-testid="download-svg-btn"
            disabled={props.disabled}
            href={URL.createObjectURL(file)}
            target="_blank"
            rel="noreferrer"
            download="output.svg"
            sx={{ textTransform: "none" }}
        >
            Download SVG
        </Button>
    );
}
