import { Fragment, useState, useEffect } from "react";
import {
    Button,
    Box,
    Typography,
    TextField,
    Stack,
    IconButton,
} from "@material-ui/core";
import MenuItem from '@mui/material/MenuItem';
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/ru';


const defaultMakeId = (title, i, id, type) => {
    let newTitle = title.replaceAll(",", "★").replaceAll(".", "✳")
    return `${newTitle}_${i}_${id}_${type}`;
};

const makeIdForMulti = (title, i, id) => {
    return `${defaultMakeId(title, i, id, "multi")}`
}

const makeIdForMultiItem = (multiName, title, id, type) => {
    let newMultiName = multiName.replaceAll(",", "★").replaceAll(".", "✳")
    return `${newMultiName}.${defaultMakeId(title, 0, id, type)}`
}

const parseId = (id) => {
    let parsed = id.split("_");
    return {
        title: parsed[0],
        id: parsed[1],
        i: parsed[2]
    };
};


const MultiFormView = ({ data, onSubmit }) => {
    const { control, handleSubmit, getValues } = useForm({
        mode: "onChange",
    });
    const [rows, setRows] = useState([])

    const addRow = () => {
        setRows((prevState) => {
            return [...prevState, data.map((item, i) => {
                return {
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    options: item.options,
                }
            })]
        })
    }

    const deleteRow = (i) => {
        let arr = [...rows]
        arr.splice(i, 1);
        setRows(arr);
    }

    useEffect(() => {
        addRow()
    }, [])

    const renderItems = (item, i, makeId, rowN) => {
        let input
        switch (item.type) {
            case "text":
                input =
                    <Controller
                        key={item.id}
                        name={makeId(item.title, item.id, item.type)}
                        control={control}
                        defaultValue={""}
                        render={({ field }) => {
                            return <TextField
                                name={makeId(item.title, item.id, item.type)}
                                fullWidth
                                label={item.title}
                                required={item.required}
                                {...field}
                            />
                        }

                        }
                    />
                break
            case "textarea":
                input =
                    <Controller
                        name={makeId(item.title, item.id, item.type)}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                multiline={true}
                                maxRows={1}
                                label={item.title}
                                required={item.required}
                                {...field}
                            />
                        )}
                    />
                break;
            case "number":
                input =
                    <Controller
                        name={makeId(item.title, item.id, item.type)}
                        control={control}
                        rules={{ pattern: /^(0|[1-9]\d*)(\.\d+)?$/ }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                multiline={true}
                                maxRows={4}
                                label={item.title}
                                required={item.required}
                                inputProps={{
                                    inputMode: "numeric",
                                    pattern: "^(0|[1-9]\d*)(\.\d+)?$",
                                }}
                                {...field}
                            />
                        )}
                    />
                break
            case "radio":
                input =
                    <Controller
                        name={makeId(item.title, item.id, item.type)}
                        control={control}
                        type="text"
                        defaultValue={[]}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                multiline={true}
                                maxRows={1}
                                label={item.title}
                                required={item.required}
                                select
                                {...field}
                            >
                                {item.options.map((item, i) => (
                                    <MenuItem key={i} value={item.title}>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                break
            case "checkbox":
                input =
                    <Controller
                        name={makeId(item.title, item.id, item.type)}
                        control={control}
                        type="text"
                        defaultValue={[]}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                multiline={true}
                                maxRows={1}
                                label={item.title}
                                required={item.required}
                                select
                                SelectProps={{ multiple: true }}
                                {...field}
                            >
                                {item.options.map((item, i) => (
                                    <MenuItem key={i} value={item.title}>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                break
            case "date":
                input =
                    <Controller
                        name={makeId(item.title, item.id, item.type)}
                        control={control}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                                <DatePicker
                                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    label={item.title}
                                    required={item.required}
                                    {...field}>
                                </DatePicker>
                            </LocalizationProvider>
                        )}
                    />
                break
            case "time":
                input =
                    <Controller
                        name={makeId(item.title, item.id, item.type)}
                        control={control}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                                <TimePicker
                                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    label={item.title}
                                    required={item.required}
                                    {...field}></TimePicker>
                            </LocalizationProvider>
                        )}
                    />
                break
            case "multi":
                input =
                    <table style={{ width: "100%" }}>
                        <tr>
                            {item.options?.map((option, j) => {
                                return renderItems(option, j, (title, id, type) =>
                                    makeIdForMultiItem(makeIdForMulti(item.title, rowN, item.id), title, id, type))
                            })}
                        </tr>
                    </table>
                break
            default:
                input = <Fragment></Fragment>;
        }
        return <td style={{ minWidth: "150px" }}>
            {input}
        </td>
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack alignItems="center">
                    <div style={{ minWidth: "100%", width: "100%", overflowY: "hidden", overflowX: "scroll" }}>
                        <table style={{ minWidth: "100%" }}>
                            <thead>
                                <tr>
                                    {data.map((item, i) => <th style={{ textAlign: "left" }}><Typography>{item.title}</Typography></th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((data, i) => {
                                    return <tr>
                                        {data.map((item, j) => renderItems(item, j, (title, id, type) => defaultMakeId(title, i, id, type), i))}
                                        <td style={{ width: "26px" }}>
                                            <IconButton onClick={() => deleteRow(i)}><ClearIcon /></IconButton>
                                        </td>
                                    </tr>
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                    <IconButton onClick={addRow}>
                        <AddIcon fontSize="large" />
                    </IconButton>
                    <Button type="submit" variant="contained">
                        Отправить
                    </Button>
                </Stack>
            </form>
        </Box >
    )
}
export default MultiFormView