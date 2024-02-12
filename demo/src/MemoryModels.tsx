import React from "react";
import { Button, Card, CardContent, TextField, Grid } from "@mui/material";

export default function MemoryModelsUserInput(props) {
    const handleTextFieldChange = (event) => {
        props.setFormData(event.target.value);
    };

    return (
        <form onSubmit={props.onSubmit}>
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
                                maxRows={20}
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
                                variant="contained"
                                color="primary"
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
