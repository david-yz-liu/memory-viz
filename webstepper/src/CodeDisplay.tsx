import React from "react";
import { CodeBlock, ocean } from "react-code-blocks";
import { Box } from "@mui/material";

type CodeDisplayPropTypes = {
    text: string;
    startingLineNumber: number;
    highlightLine: number;
};

export default function CodeDisplay(props: CodeDisplayPropTypes) {
    return (
        <Box sx={{ width: "50%", backgroundColor: "white" }}>
            <CodeBlock
                text={props.text}
                language="python"
                showLineNumbers={true}
                startingLineNumber={props.startingLineNumber}
                highlight={props.highlightLine.toString()}
                codeContainerStyle={{ width: "100%", backgroundColor: "white" }}
                customStyle={{
                    height: "100%",
                    overflowY: "scroll",
                    fontFamily: "monospace",
                }}
            />
        </Box>
    );
}

export type { CodeDisplayPropTypes };
