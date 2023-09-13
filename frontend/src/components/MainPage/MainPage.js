import { useEffect, useState } from "react";
import { FormService } from "../../services/FormService";
import { Grid, IconButton, Paper } from "@material-ui/core";
import Box from "@mui/material/Box";
import FormCard from "./elements/FormCard";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";

const MainPage = () => {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const onEdit = (alias) => {
        navigate(`/admin/form/edit/${alias}`);
    };

    const onShare = (alias) => {
        try {
            navigator.clipboard.writeText(
                `${window.location.host}/form/${alias}`
            );
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";
            textArea.value = `${window.location.host}/form/${alias}`;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
        }
    };

    const onDownload = (formId) => {
        FormService.download(formId).catch((err) => {
            if (err?.response?.status == 404) {
                enqueueSnackbar("Ответы для формы не найдены", {
                    variant: "warning",
                });
            } else {
                enqueueSnackbar("Ошибка скачивания", { variant: "error" });
            }
        });
    };

    const onDelete = (id, alias) => {
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

    const onOpenForm = (formId) => {
        navigate(`/admin/form/answers/${formId}`);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getForms = async () => {
            try {
                const data = await FormService.getAll();
                if (isMounted && data?.length) {
                    setForms((prevState) => [...data, ...prevState]);
                }
            } catch (err) {
                enqueueSnackbar("Ошибка загрузки форм", {
                    variant: "error",
                });
            }
            setIsLoading(false);
        };

        if (isMounted) {
            getForms();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <CircularProgress />
            </Box>
        );
    }

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
                                onOpenForm(form.id);
                            }}
                            onDelete={() => {
                                onDelete(i, form.alias);
                            }}
                            onShare={() => {
                                onShare(form.alias);
                            }}
                            onDownload={() => {
                                onDownload(form.id);
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
                            onClick={() => navigate("/admin/form/create")}>
                            <AddIcon fontSize="large"></AddIcon>
                        </IconButton>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
export default MainPage;
