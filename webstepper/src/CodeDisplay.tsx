import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
    a11yLight,
    a11yDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Box } from "@mui/material";

type CodeDisplayPropTypes = {
    text: string;
    startingLineNumber: number;
    highlightLine: number;
    isDarkMode: boolean;
};

export default function CodeDisplay(props: CodeDisplayPropTypes) {
    const a11yTheme = props.isDarkMode ? a11yDark : a11yLight;
    return (
        <Box className="code-display__code-box">
            <SyntaxHighlighter
                data-testid="code-box"
                language="python"
                showLineNumbers={true}
                startingLineNumber={props.startingLineNumber}
                wrapLines={true}
                wrapLongLines={true}
                style={a11yTheme}
                lineProps={(lineNumber: number) => {
                    if (lineNumber == props.highlightLine) {
                        return {
                            className: `code-box__line--highlighted${props.isDarkMode ? "-dark" : ""}`,
                        };
                    }
                }}
            >
                {props.text}
            </SyntaxHighlighter>
        </Box>
    );
}

export type { CodeDisplayPropTypes };
