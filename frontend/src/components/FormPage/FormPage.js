import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Button,
    Box,
    Typography,
    TextField,
    Stack,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import { FormService } from "../../services/FormService";
import { useSnackbar } from "notistack";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Input from "@material-ui/core/Input";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import { redirect, useNavigate } from "react-router-dom";

const FormPage = () => {
    const { alias } = useParams();
    const [formId, setFormId] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState("text");

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { control, handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        console.log(typeof data);
        console.log(Object.entries(data));
        console.log(formId);

        FormService.answer({
            user_id: "1",
            form_id: formId,
            items: Object.entries(data).map((entry) => {
                let parsedId = parseId(entry[0]);
                return {
                    id: parsedId.id,
                    title: parsedId.title,
                    value: entry[1],
                };
            }),
        })
            .then(() => {
                enqueueSnackbar("Ответ сохранён", {
                    variant: "success",
                });
                navigate("/form/response");
            })
            .catch(() => {
                enqueueSnackbar("Ошибка сохранения", {
                    variant: "error",
                });
            });
    };

    const makeId = (title, id) => {
        return `${title}_${id}`;
    };

    const parseId = (id) => {
        let parsed = id.split("_");
        return {
            title: parsed[0],
            id: parsed[1],
        };
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getForm = async () => {
            try {
                const data = await FormService.get(alias);
                console.log(data);
                console.log(formId);
                if (isMounted) {
                    setFormId(data.id);
                    setTitle(data.title);
                    setDescription(data.description);
                    setData(data.items);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (isMounted) {
            getForm();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <Box width={800} marginX="auto">
            <Typography variant="h4">{title}</Typography>
            <Typography variant="body1" marginBottom={5}>
                {description}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    {data.map((item, i) => {
                        switch (item.type) {
                            case "text":
                                return (
                                    <>
                                        <Typography>
                                            {item.id + 1}. Title
                                        </Typography>
                                        <Controller
                                            name={makeId(item.title, item.id)}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    label={item.title}
                                                    required={item.required}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </>
                                );
                            case "textarea":
                                return (
                                    <>
                                        <Typography>
                                            {item.id + 1}. Title
                                        </Typography>
                                        <Controller
                                            name={makeId(item.title, item.id)}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    multiline={true}
                                                    maxRows={4}
                                                    label={item.title}
                                                    required={item.required}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </>
                                );
                            case "number":
                                return (
                                    <>
                                        <Typography>
                                            {item.id + 1}. Title
                                        </Typography>
                                        <Controller
                                            name={makeId(item.title, item.id)}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    multiline={true}
                                                    maxRows={4}
                                                    label={item.title}
                                                    required={item.required}
                                                    inputProps={{
                                                        inputMode: "numeric",
                                                        pattern: "[0-9]*",
                                                    }}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </>
                                );
                            case "radio":
                                return (
                                    <>
                                        <Typography>
                                            {item.id + 1}. Title
                                        </Typography>
                                        <Controller
                                            name={makeId(item.title, item.id)}
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl {...field}>
                                                    <FormLabel>
                                                        {item.title}
                                                    </FormLabel>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="female"
                                                        name="radio-buttons-group">
                                                        {item.options?.map(
                                                            (item) => {
                                                                return (
                                                                    <FormControlLabel
                                                                        value={
                                                                            item.value
                                                                        }
                                                                        control={
                                                                            <Radio />
                                                                        }
                                                                        label={
                                                                            item.value
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        />
                                    </>
                                );
                            case "date":
                                return (
                                    <>
                                        <Typography>
                                            {item.id + 1}. Title
                                        </Typography>
                                        <Controller
                                            name={makeId(item.title, item.id)}
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label={item.title}
                                                    required={item.required}
                                                    {...field}></DatePicker>
                                            )}
                                        />
                                    </>
                                );
                            case "time":
                                return (
                                    <>
                                        <Typography>
                                            {item.id + 1}. Title
                                        </Typography>
                                        <Controller
                                            name={makeId(item.title, item.id)}
                                            control={control}
                                            render={({ field }) => (
                                                <TimePicker
                                                    label={item.title}
                                                    required={item.required}
                                                    {...field}></TimePicker>
                                            )}
                                        />
                                    </>
                                );
                            default:
                                return <Fragment></Fragment>;
                        }
                    })}
                    <Button type="submit" variant="contained">
                        Отправить
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};
export default FormPage;
