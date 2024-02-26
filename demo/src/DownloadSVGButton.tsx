import React from "react";
import { Button } from "@mui/material";

type DownloadSVGButtonPropTypes = {
    svgResult: string;
};
export default function DownloadSVGButton(props: DownloadSVGButtonPropTypes) {
    const file = new Blob([props.svgResult], { type: "image/svg+xml" });

    return (
        <Button
            variant="contained"
            color="primary"
            style={{ fontFamily: "Monospace" }}
            href={URL.createObjectURL(file)}
            target="_blank"
            rel="noreferrer"
            download="output.svg"
        >
            Download SVG
        </Button>
    );
}
