import { useEffect, useRef, useState } from "react";
import { FormService } from "../../services/FormService";
import { Grid, IconButton, Paper } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";

const AnswersPage = () => {
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { formId } = useParams();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAnswers = async () => {
            try {
                const data = await FormService.getAnswers(formId);
                if (isMounted && data.length) {
                    setAnswers(data);
                    setColumns(
                        data[0].items.map((item) => {
                            return {
                                field: item.title,
                                headerName: item.title,
                            };
                        })
                    );

                    let answers = data.map((answer) => answer.items);
                    setRows(
                        answers.map((answer, i) => {
                            let res = answer.reduce((rows, a) => {
                                return {
                                    ...rows,
                                    [a.title]: a.value,
                                };
                            }, {});
                            res.id = i;
                            return res;
                        })
                    );
                }
            } catch (err) {
                setError(err);
                enqueueSnackbar("Ошибка загрузки ответов", {
                    variant: "error",
                });
            }
            setIsLoading(false);
        };

        if (isMounted) {
            getAnswers();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    if (error) {
        return (
            <Typography align="center" variant="h5">
                Ответов не найдено
            </Typography>
        );
    }

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
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 20, 50]}
                checkboxSelection
            />
        </div>
    );
};
export default AnswersPage;
