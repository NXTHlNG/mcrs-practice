import { Fragment } from "react";
import {
    Button,
    Typography,
    TextField,
    Stack,
    Box,
} from "@material-ui/core";
import MenuItem from '@mui/material/MenuItem';
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";

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
        i: parsed[1],
        id: parsed[2],
        type: parsed[3]
    };
};


const DefaultFormView = ({ data, onSubmit }) => {
    const { control, handleSubmit, getValues } = useForm({ mode: "onChange" });
    const renderItems = (item, i, makeId) => {
        switch (item.type) {
            case "text":
                return (
                    <>
                        <Typography>
                            {item.id + 1}. {item.title}
                        </Typography>
                        <Controller
                            name={makeId(item.title, item.id, item.type)}
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
                            {item.id + 1}. {item.title}
                        </Typography>
                        <Controller
                            name={makeId(item.title, item.id, item.type)}
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
                            {item.id + 1}. {item.title}
                        </Typography>
                        <Controller
                            name={makeId(item.title, item.id, item.type)}
                            control={control}
                            rules={{ pattern: /^(0|[1-9]\d*)(\.\d+)?$/ }}
                            render={({ field }) => (
                                <TextField
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
                    </>
                );
            case "radio":
                return (
                    <>
                        <Typography>
                            {item.id + 1}. {item.title}
                        </Typography>
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
                    </>
                );
            case "checkbox":
                return (
                    <>
                        <Typography>
                            {item.id + 1}. {item.title}
                        </Typography>
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
                    </>
                );
            case "date":
                return (
                    <>
                        <Typography>
                            {item.id + 1}. {item.title}
                        </Typography>
                        <Controller
                            name={makeId(item.title, item.id, item.type)}
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
                            {item.id + 1}. {item.title}
                        </Typography>
                        <Controller
                            name={makeId(item.title, item.id, item.type)}
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
            case "multi":
                return (
                    <>
                        <Typography>
                            {item.id + 1}. {item.title}
                        </Typography>
                        <Stack spacing={2} sx={{
                            "&&": {
                                ml: 2
                            }
                        }}>
                            {item.options.map((option, i) => renderItems(option, i, (title, id, type) => {
                                let multiName = makeIdForMulti(item.title, 0, item.id)
                                return makeIdForMultiItem(multiName, title, id, type)
                            }))}
                        </Stack>
                    </>
                )
            default:
                return <Fragment></Fragment>;
        }
    }

    return (
        <Box width={800} marginX="auto">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    {data.map((item, i) => renderItems(item, i, (title, id, type) => {
                        return defaultMakeId(title, 0, id, type)
                    }))}
                    <Button type="submit" variant="contained">
                        Отправить
                    </Button>
                </Stack>
            </form>
        </Box>

    )
}
export default DefaultFormView