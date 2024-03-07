import React from "react";
import { Button } from "@mui/material";

type DownloadSVGButtonPropTypes = {
    svgResult: string;
};
export default function DownloadSVGButton(props: DownloadSVGButtonPropTypes) {
    const file = new global.Blob([props.svgResult], { type: "image/svg+xml" });

    return (
        <Button
            variant="contained"
            color="primary"
            data-testid="download-svg-btn"
            disabled={!props.svgResult}
            href={URL.createObjectURL(file)}
            target="_blank"
            rel="noreferrer"
            download="output.svg"
            sx={{ textTransform: "none" }}
        >
            Download This SVG
        </Button>
    );
}
