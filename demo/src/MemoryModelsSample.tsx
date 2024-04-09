import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

type MemoryModelsSamplePropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    setConfigData: React.Dispatch<React.SetStateAction<object>>;
    onTextDataSubmit: () => void;
};

export default function MemoryModelsSample(props: MemoryModelsSamplePropTypes) {
    const [fileContents, setFileContents] = useState<{
        [key: string]: [string, Object];
    }>({});
    const [clickedBtnIndex, setClickedBtnIndex] = useState<Number>(null);

    useEffect(() => {
        if (clickedBtnIndex !== null) {
            props.onTextDataSubmit();
        }
    }, [clickedBtnIndex]);

    // useEffect with empty dependency array mimics componentDidMount
    // https://stackoverflow.com/a/58579462
    useEffect(() => {
        const samples = [
            "automation",
            "blankspace",
            "manual",
            "simple",
            "style",
        ];
        const tempFileContents = {};
        for (const sample of samples) {
            // client-side React doesn't have many options for reading local files
            // fs doesn't work. Alternatively since the goal is storing string,
            // we can just store the file as the product of JSON.stringify in .txt
            // but that'd be a design choice
            tempFileContents[sample] = [
                JSON.stringify(
                    require(`./sample/${sample}/${sample}.json`),
                    null,
                    2
                ),
                require(`./sample/${sample}/config.json`),
            ];
        }
        setFileContents({
            ...tempFileContents,
        });
    }, []);

    const handleButtonClick = (
        index: Number,
        content: string,
        config: Object
    ) => {
        props.setTextData(content);
        props.setConfigData((prevConfigData) => ({
            ...prevConfigData,
            ...config,
        }));
        setClickedBtnIndex(index);
    };

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                data-testid="sample-inputs-accordion"
            >
                Sample Inputs
            </AccordionSummary>
            <AccordionDetails>
                <Card color="neutral">
                    <CardContent>
                        <Grid container spacing={2}>
                            {Object.entries(fileContents).map((file, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleButtonClick(
                                                index,
                                                file[1][0],
                                                file[1][1]
                                            )
                                        }
                                        color={
                                            index === clickedBtnIndex
                                                ? "success"
                                                : "primary"
                                        }
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {file[0]}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </AccordionDetails>
        </Accordion>
    );
}
