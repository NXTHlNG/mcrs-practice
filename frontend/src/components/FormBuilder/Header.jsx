import { Fragment, useState } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

const Header = ({ title, description, setTitle, setDescription }) => {
    return (
        <Fragment>
            <Box sx={{ mb: 3 }}>
                <Paper
                    elevation={2}
                    sx={{ p: 3, borderTop: "8px solid #9C27B0" }}>
                    <TextField
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="standard"
                        placeholder="Form Title"
                        name="title"
                        sx={{ mb: 3 }}
                        fullWidth
                    />
                    <TextField
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="standard"
                        placeholder="Form Description"
                        fullWidth
                        sx={{ mb: 2 }}
                        multiline
                        rows={2}
                    />
                </Paper>
            </Box>
        </Fragment>
    );
};

export default Header;
