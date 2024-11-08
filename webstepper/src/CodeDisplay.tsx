import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Box } from "@mui/material";
import "./css/styles.css";

type CodeDisplayPropTypes = {
    text: string;
    startingLineNumber: number;
    highlightLine: number;
};

export default function CodeDisplay(props: CodeDisplayPropTypes) {
    return (
        <Box className="code-display__code-box">
            <SyntaxHighlighter
                data-testid="code-box"
                language="python"
                showLineNumbers={true}
                startingLineNumber={props.startingLineNumber}
                wrapLines={true}
                wrapLongLines={true}
                style={a11yLight}
                customStyle={{ backgroundColor: "transparent" }}
                lineProps={(lineNumber: number) => {
                    if (lineNumber == props.highlightLine) {
                        return { className: "code-box__line--highlighted" };
                    }
                    console.log(lineNumber);
                    console.log(props.highlightLine);
                }}
            >
                {props.text}
            </SyntaxHighlighter>
        </Box>
    );
}

export type { CodeDisplayPropTypes };
