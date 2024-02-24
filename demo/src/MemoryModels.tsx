import React from "react";
import { Button, Card, CardContent, TextField, Grid } from "@mui/material";

type MemoryModelsUserInputPropTypes = {
    onSubmit: (event: React.MouseEvent<HTMLFormElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<string>>;
    formData: string;
};

export default function MemoryModelsUserInput(
    props: MemoryModelsUserInputPropTypes
) {
    const handleTextFieldChange = (event) => {
        props.setFormData(event.target.value);
    };

    return (
        <form data-testid="input-form" onSubmit={props.onSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="multiline-textfield"
                                label="Enter memory model JSON here"
                                multiline
                                fullWidth
                                rows={10}
                                variant="outlined"
                                value={props.formData}
                                onChange={handleTextFieldChange}
                                style={{
                                    width: "100%",
                                    fontFamily: "Monospace",
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                data-testid="input-submit-button"
                                variant="contained"
                                color="primary"
                                disabled={!props.formData}
                                style={{ textTransform: "none" }}
                            >
                                Draw Diagram
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
}
