import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Button,
    Box,
    Typography,
} from "@material-ui/core";
import { FormService } from "../../services/FormService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import MultiFormView from "./MultiView";
import DefaultFormView from "./DefalutView";

const FormPage = () => {
    const { alias } = useParams();
    const [formId, setFormId] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [data, setData] = useState([]);
    const [isMultiForm, setIsMultiForm] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const makeId = (title, id) => {
        return `${title}_${id}`;
    };

    const parseId = (id) => {
        let parsed = id.split("_");
        return {
            title: parsed[0].replaceAll("★", ",").replaceAll("✳", "."),
            i: parsed[1],
            id: parsed[2],
            type: parsed[3]
        };
    };

    const mapToAnswerItem = (data) => {
        return Object.entries(data).map((entry) => {
            let parsedId = parseId(entry[0]);
            return {
                i: parsedId.i,
                id: parsedId.id,
                title: parsedId.title,
                type: parsedId.type,
                value: parsedId.type !== "multi" ? entry[1] : mapToAnswerItem(entry[1])
            };
        })
    }

    const parseAnswers = (data) => {
        console.log(data)
        let answers = mapToAnswerItem(data)

        const groupedByI = {};

        for (const obj of answers) {
            if (!groupedByI[obj.i]) {
                groupedByI[obj.i] = [];
            }
            groupedByI[obj.i].push({
                id: obj.id,
                title: obj.title,
                type: obj.type,
                value: obj.value
            });
        }

        const resultArray = [];

        for (const i in groupedByI) {
            resultArray.push({
                form_id: formId,
                items: groupedByI[i]
            });
        }

        return resultArray
    }

    const onSubmit = (data) => {
        FormService.answer({ answers: parseAnswers(data) })
            .then(() => {
                enqueueSnackbar("Ответ сохранён", {
                    variant: "success",
                });
                navigate(`/form/response/${alias}`);
            })
            .catch((err) => {
                setError(err);
                enqueueSnackbar("Ошибка сохранения", {
                    variant: "error",
                });
            });
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getForm = async () => {
            try {
                const data = await FormService.get(alias);
                if (isMounted) {
                    setFormId(data.id);
                    setTitle(data.title);
                    setDescription(data.description);
                    setData(data.items);
                }
            } catch (err) {
                setError(err);
                if (err?.response?.status !== 404) {
                    enqueueSnackbar("Ошибка загрузки", { variant: "error" });
                }
            }
            setIsLoading(false);
        };

        if (isMounted) {
            getForm();
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

    return error?.response?.status == 404 ? (
        <Typography align="center" variant="h5">
            Форма не найдена
        </Typography>
    ) : (
        <Box>
            <Box width={800} marginBottom={5} marginX="auto">
                <Typography variant="h4">{title}</Typography>
                <Typography variant="body1">
                    {description}
                </Typography>
                <Button variant="contained" sx={{ position: "absolute", top: "20px", right: "20px" }} onClick={() => setIsMultiForm(!isMultiForm)}>
                    {"Переключить вид"}
                    {/* {isMultiForm ? <CropLandscapeIcon /> : <CropPortraitIcon />} */}
                </Button>
            </Box>
            {isMultiForm ?
                <MultiFormView
                    data={data}
                    onSubmit={onSubmit}
                /> :
                <DefaultFormView
                    data={data}
                    onSubmit={onSubmit}
                />}
        </Box>
    );
};
export default FormPage;
