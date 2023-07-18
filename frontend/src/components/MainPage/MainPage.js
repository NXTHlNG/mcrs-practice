import { useEffect, useRef, useState } from "react";
import { FormService } from "../../services/FormService";
import { Grid, IconButton, Paper } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormCard from "./elements/FormCard";
import AddIcon from "@mui/icons-material/Add";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";

const MainPage = () => {
    const [forms, setForms] = useState([
        { title: "default", description: "default", alias: "0" },
    ]);

    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const onEdit = (alias) => {
        navigate(`/form/edit/${alias}`);
    };

    const onShare = (alias) => {
        navigator.clipboard.writeText(`${window.location.host}/form/${alias}`);
    };

    const onDownload = () => {
        //
    }

    const onDelete = (id, alias) => {
        console.log(id);
        FormService.delete(alias)
            .then(() => {
                setForms((prevState) => {
                    return prevState.filter((v) => v.alias !== alias);
                });
            })
            .catch(() =>
                enqueueSnackbar("Не удалось удалить форму", {
                    variant: "error",
                })
            );
    };

    const onOpenForm = (alias) => {
        navigate(`/form/${alias}`);
    };

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
                enqueueSnackbar("Ошибка загрузки форм", {
                    variant: "error",
                });
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
                {forms.map((form, i) => (
                    <Grid item xs={3} key={form.alias}>
                        <FormCard
                            title={form.title}
                            description={form.description}
                            onEdit={() => {
                                onEdit(form.alias);
                            }}
                            onOpenForm={() => {
                                onOpenForm(form.alias);
                            }}
                            onDelete={() => {
                                onDelete(i, form.alias);
                            }}
                            onShare={() => {
                                onShare(form.alias);
                            }}
                            onDownload={() => {
                                onDownload()
                            }}
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
