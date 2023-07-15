import { useEffect, useRef, useState } from "react";
import { FormService } from "../../services/FormService";
import { Grid, IconButton, Paper } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormCard from "./elements/FormCard";
import AddIcon from "@mui/icons-material/Add";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

const bull = (
    <Box
        component="span"
        sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
        •
    </Box>
);

const MainPage = () => {
    const [forms, setForms] = useState([
        { title: "default", description: "default", alias: "0" },
    ]);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getForms = async () => {
            try {
                const data = await FormService.getAll();
                console.log(data);
                if (isMounted) {
                    setForms((prevState) => [...data, ...prevState]);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (isMounted) {
            getForms();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <Box
            sx={{
                width: 1200,
                marginX: "auto",
            }}>
            <Grid container spacing={2}>
                {forms.map((form) => (
                    <Grid item xs={3} key={form.alias}>
                        <FormCard
                            title={form.title}
                            description={form.description}
                        />
                    </Grid>
                ))}
                <Grid item xs={3}>
                    <Paper
                        sx={{
                            width: 275,
                            height: "100%",
                            display: "flex",
                            alignProperty: "center",
                            justifyContent: "center",
                        }}>
                        <IconButton
                            size="large"
                            sx={{
                                width: "100%",
                            }}
                            onClick={() => navigate("/form/create")}>
                            <AddIcon fontSize="large"></AddIcon>
                        </IconButton>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
export default MainPage;
