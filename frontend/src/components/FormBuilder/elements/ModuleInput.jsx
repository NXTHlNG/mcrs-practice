import { Fragment } from "react";
import uuid from "react-uuid";
//Material UI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Nestable from "react-nestable";


//Icons
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import FileCopyIcon from '@material-ui/icons/FileCopy';

//Form Elements
import { formEl } from "../constants";

const ModuleInput = ({
    item,
    handleValue,
    deleteEl,
    handleRequired,
    handleElType,
    addOption,
    handleOptionValues,
    deleteOption,
    duplicateElement,
    renderElements,
    handleOnChangeSort,
    addChildren,
    depth,
    handler
}) => {

    //Create new option
    const createNewOption = (id) => {
        const data = {
            id: uuid(),
            value: "",
            type: "text",
            required: false,
        };
        // addOption(id, opt);
        addChildren(id, data);
    };

    return (
        <Fragment>
            <Paper elevation={1}>
                <Box sx={{ textAlign: "center" }}>
                    {handler}
                </Box>
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={9}>
                            <TextField
                                defaultValue={item.value}
                                variant="outlined"
                                onBlur={(e) => handleValue(item.id, e)}
                                fullWidth
                                required={item.required}
                                placeholder="Заголовок"
                                sx={{ mb: 2 }}
                            />
                            {
                                depth == 0 ?
                                    <Button variant="text" onClick={() => createNewOption(item.id)}>
                                        Добавить поле
                                    </Button> : <></>
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="el-type-label">Type</InputLabel>
                                <Select
                                    labelId="el-type-label"
                                    id="el-type"
                                    label="Тип"
                                    value={item.type}
                                    onChange={(e) => handleElType(item.id, e.target.value)}
                                >
                                    {formEl &&
                                        formEl.map((el, key) => {
                                            return el.value == "multi" && depth !== 0 ? null :
                                                <MenuItem key={key} value={el.value}>
                                                    {el.label}
                                                </MenuItem>
                                        })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <Divider light />
                <FormGroup row sx={{ alignItems: "center" }}>
                    <Tooltip title="Удалить элемент" aria-label="delete-element">
                        <IconButton
                            aria-label="delete-element"
                            onClick={() => deleteEl(item.id)}
                            sx={{ ml: 2 }}
                        >
                            <DeleteOutlineOutlinedIcon color="secondary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Дублировать элемент" aria-label="duplicate-element">
                        <IconButton
                            aria-label="duplicate-element"
                            onClick={() => duplicateElement(item.id, item.type)}
                            sx={{ ml: 2 }}
                        >
                            <FileCopyIcon color="secondary" />
                        </IconButton>
                    </Tooltip>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={item.required}
                                onChange={() => handleRequired(item.id)}
                                name="required-field"
                                color="secondary"
                            />
                        }
                        label="Обязательно"
                        sx={{ ml: 2 }}
                    />
                </FormGroup>
            </Paper>
        </Fragment>
    );
};

export default ModuleInput;