import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Box } from "@mui/material";

type CodeDisplayPropTypes = {
    text: string;
    startingLineNumber: number;
    highlightLine: number;
};

export default function CodeDisplay(props: CodeDisplayPropTypes) {
    const lineBackground = (lineNumber: number) => {
        if (lineNumber == props.highlightLine) {
            return "#ffff00";
        }
    };

    return (
        <Box sx={{ width: "100%", height: "100%", backgroundColor: "white" }}>
            <SyntaxHighlighter
                data-testid="code-box"
                language="python"
                showLineNumbers={true}
                startingLineNumber={props.startingLineNumber}
                wrapLines={true}
                wrapLongLines={true}
                style={a11yLight}
                customStyle={{ backgroundColor: "transparent" }}
                lineProps={(lineNumber) => ({
                    style: {
                        backgroundColor: lineBackground(lineNumber),
                    },
                })}
            >
                {props.text}
            </SyntaxHighlighter>
        </Box>
    );
}

export type { CodeDisplayPropTypes };
