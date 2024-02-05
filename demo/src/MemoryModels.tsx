import React from "react";
import { Button, Card, CardContent, TextField, Grid } from "@mui/material";

interface MemoryModel {
    isClass: boolean;
    name: string;
    id: string | number | null;
    value: any;
    stack_frame: boolean;
    show_indexes: boolean;
    style?: any[] | null;
}

function MemoryModels(props) {
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
                                label="Multi-line Text"
                                multiline
                                fullWidth
                                rows={10}
                                maxRows={20}
                                variant="outlined"
                                value={props.formData}
                                onChange={handleTextFieldChange}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
}

export { MemoryModels };
export type { MemoryModel };
