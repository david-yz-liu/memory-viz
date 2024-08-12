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

import { SAMPLES } from "./sample";

type MemoryModelsSamplePropTypes = {
    setTextData: React.Dispatch<React.SetStateAction<string>>;
    setConfigData: React.Dispatch<React.SetStateAction<object>>;
    onTextDataSubmit: () => void;
};

export default function MemoryModelsSample(props: MemoryModelsSamplePropTypes) {
    const [clickedBtnIndex, setClickedBtnIndex] = useState<Number>(null);

    useEffect(() => {
        if (clickedBtnIndex !== null) {
            props.onTextDataSubmit();
        }
    }, [clickedBtnIndex]);

    const handleButtonClick = (index: Number, sample: Object) => {
        // Note: the following conversion to a string is inefficient, as the data is later parsed
        // back into JSON for rendering.
        // TODO: fix this.
        props.setTextData(JSON.stringify(sample["data"], null, 4));
        props.setConfigData((prevConfigData) => ({
            ...prevConfigData,
            ...sample["config"],
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
                            {SAMPLES.map((sample, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleButtonClick(index, sample)
                                        }
                                        color={
                                            index === clickedBtnIndex
                                                ? "success"
                                                : "primary"
                                        }
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {sample["name"]}
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
