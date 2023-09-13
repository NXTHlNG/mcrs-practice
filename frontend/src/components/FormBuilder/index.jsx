import { Fragment, useState, useEffect } from "react";
import uuid from "react-uuid";
import Nestable from "react-nestable";
//Material UI Components
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
//Icons
//Form Elements
import {
    TextFieldInput,
    TextArea,
    NumberInput,
    RadioInput,
    DateInput,
    TimeInput,
    ModuleInput
} from "./elements";
import { formEl } from "./constants.js";
import { Typography } from "@material-ui/core";
//Components
import Header from "./Header";
import { useParams } from "react-router-dom";
import { Button, Box } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import { FormService } from "../../services/FormService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const FormBuilder = ({ onSave }) => {
    const initVal = formEl[0]?.value;

    //State
    const [title, setTitle] = useState("Новая форма");
    const [description, setDescription] = useState();
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState("text");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const items = data;
    const { alias } = useParams();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getForm = async () => {
            try {
                const data = await FormService.get(alias);
                if (isMounted) {
                    setTitle(data.title);
                    setDescription(data.description);
                    setData(
                        data.items.map((item) => {
                            const newItem = {
                                id: uuid(),
                                value: item.title,
                                type: item.type,
                                required: item.required,
                                options: item.type !== "multi" ? item.options?.map((option) => {
                                    let newOption = {
                                        id: uuid(),
                                        value: option.title,
                                    };
                                    return newOption;
                                }) : null,
                                children: item.type === "multi" ? item.options?.map((option) => {
                                    let newChild = {
                                        id: uuid(),
                                        value: option.title,
                                        options: option.options?.map((option) => {
                                            let newOption = {
                                                id: uuid(),
                                                value: option.title,
                                            }
                                            return newOption
                                        }),
                                        required: option.required,
                                        type: option.type
                                    }
                                    return newChild
                                }) : null
                            };
                            return newItem;
                        })
                    );
                }
            } catch (err) {
                setError(err);
                if (err?.response?.status !== 404) {
                    enqueueSnackbar("Ошибка загрузки", { variant: "error" });
                }
            }
            setIsLoading(false);
        };

        if (isMounted && alias) {
            getForm();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    //Function to add new element
    const addElement = () => {
        const data = {
            id: uuid(),
            value: "",
            type: formData,
            required: false,
        };
        setData((prevState) => [...prevState, data]);
        setFormData(initVal);
    };

    function deleteElementById(data, idToDelete) {
        return data.filter((element) => {
            if (element.id === idToDelete) {
                return false; // Exclude this element from the filtered array
            }

            if (element.children) {
                element.children = deleteElementById(element.children, idToDelete);
            }

            return true; // Include other elements in the filtered array
        });
    }

    //Function to delete element
    const deleteEl = (id) => {
        // setData((prevState) => prevState.filter((val) => val.id !== id));
        let newArr = deleteElementById(data, id)
        setData(newArr)
    };

    //Function to add element at specific pos and return arr
    const addAfter = (elArray, index, newEl) => {
        return [
            ...elArray.slice(0, index + 1),
            newEl,
            ...elArray.slice(index + 1),
        ];
    };

    //Function to duplicate element
    const duplicateElement = (elId, elType) => {
        let elIdx = data.findIndex((el) => el.id === elId);
        let newEl = {
            id: uuid(),
            value: null,
            type: elType,
            required: false,
        };
        let newArr = addAfter(data, elIdx, newEl);
        setData(newArr);
    };

    //Function to handle sorting of elements
    const handleOnChangeSort = ({ items }) => {
        setData(items);
    };

    const confirmChange = ({ dragItem, destinationParent }) => {
        if (destinationParent && destinationParent.type !== "multi") {
            return false
        }
        if (dragItem.type === "multi" && destinationParent?.type === "multi") {
            return false
        }
        return true
    }

    function updateElementById(data, idToUpdate, updateFunction) {
        return data.map((element) => {
            if (element.id === idToUpdate) {
                return updateFunction(element);
            }

            if (element.children) {
                return { ...element, children: updateElementById(element.children, idToUpdate, updateFunction) };
            }

            return element;
        });
    }

    //Function to Handle Input Values
    const handleValue = (id, e) => {
        let newArr = updateElementById(data, id, (el) => { return { ...el, value: e.target.value } })
        setData(newArr);
    };

    //Function to Handle Required
    const handleRequired = (id) => {
        let newArr = updateElementById(data, id, (el) => { return { ...el, required: !el.required } })
        setData(newArr);
    };

    //Function to Handle Element Type
    const handleElType = (id, type) => {
        let newArr = updateElementById(data, id, (el) => { return { ...el, type: type } })
        setData(newArr);
    };

    //Function to Handle Options
    const addOption = (id, newOption) => {
        let newArr = updateElementById(data, id, (el) => {
            const objVal = "options" in el ? el?.options?.length > 0 ? el?.options : [] : [];
            return { ...el, options: [...objVal, newOption] };
        })
        setData(newArr);
    };

    const addChildren = (id, newChildren) => {
        let newArr = updateElementById(data, id, (el) => {
            const objVal = "children" in el ? el?.children?.length > 0 ? el?.children : [] : [];
            return { ...el, children: [...objVal, newChildren] }
        })
        setData(newArr);
    };

    //Function to Handle Date
    const handleDate = (id, dateVal) => {
        let newArr = updateElementById(data, id, (el) => { return { ...el, date: dateVal } })
        setData(newArr);
    };

    //Function to Handle Time
    const handleTime = (id, dateVal) => {
        let newArr = updateElementById(data, id, (el) => { return { ...el, time: dateVal } })
        setData(newArr);
    };

    //Function to Change Option Values
    const handleOptionValues = (elId, optionId, optionVal) => {
        let newArr = updateElementById(data, elId, (el) => {
            el?.options &&
                el?.options.map((opt) => {
                    if (opt.id == optionId) {
                        opt.value = optionVal;
                    }
                });
            return el;
        })
        setData(newArr);
    };

    //Function to Delete Optin
    const deleteOption = (elId, optionId) => {
        let newArr = updateElementById(data, elId, (el) => {
            let newOptions =
                el?.options &&
                el?.options.filter((opt) => opt.id != optionId);
            return { ...el, options: newOptions };
        })
        setData(newArr);
    };

    //Render items
    const renderElements = ({ item, depth, handler }) => {
        switch (item.type) {
            case "text":
                return (
                    <TextFieldInput
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        duplicateElement={duplicateElement}
                    />

                );
            case "textarea":
                return (
                    <TextArea
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        duplicateElement={duplicateElement}
                    />
                );
            case "number":
                return (
                    <NumberInput
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        duplicateElement={duplicateElement}
                    />
                );
            case "radio":
                return (
                    <RadioInput
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        addOption={addOption}
                        handleOptionValues={handleOptionValues}
                        deleteOption={deleteOption}
                        duplicateElement={duplicateElement}
                    />
                );
            case "checkbox":
                return (
                    <RadioInput
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        addOption={addOption}
                        handleOptionValues={handleOptionValues}
                        deleteOption={deleteOption}
                        duplicateElement={duplicateElement}
                    />
                );
            case "date":
                return (
                    <DateInput
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        handleDate={handleDate}
                        duplicateElement={duplicateElement}
                    />
                );
            case "time":
                return (
                    <TimeInput
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        handleTime={handleTime}
                        duplicateElement={duplicateElement}
                    />
                );
            case "multi":
                return (
                    <ModuleInput
                        handler={handler}
                        depth={depth}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        addOption={addOption}
                        handleOptionValues={handleOptionValues}
                        deleteOption={deleteOption}
                        duplicateElement={duplicateElement}
                        handleOnChangeSort={handleOnChangeSort}
                        renderElements={renderElements}
                        addChildren={addChildren}
                    />
                )
            default:
                return <Fragment></Fragment>;
        }
    };

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

    if (error?.response?.status == 404) {
        return (
            <Typography align="center" variant="h5">
                Форма не найдена
            </Typography>
        );
    }

    if (error) {
        return (
            <Typography align="center" variant="h5">
                Ошибка загрузки формы
            </Typography>
        );
    }

    const handlerStyles = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "10px",
        height: "100%",
        background: "steelblue",
        cursor: "pointer"
    };

    return (
        <Fragment>
            <Box width={1200} marginX="auto">
                <Grid container direction="column" justifyContent="center">
                    <Grid item md={12}>
                        <Header
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                        />
                        <Nestable
                            handler={<DragIndicatorIcon
                                sx={{ transform: "rotate(-90deg)", cursor: "all-scroll" }}
                            />}
                            items={items}
                            renderItem={renderElements}
                            maxDepth={2}
                            onChange={handleOnChangeSort}
                            collapsed={false}
                            confirmChange={confirmChange}
                        />
                    </Grid>
                    <Grid item md={1} display="flex" justifyContent="center">
                        <Tooltip title="Add Element" aria-label="add-element">
                            <IconButton
                                aria-label="add-element"
                                onClick={addElement}>
                                <AddIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{ marginX: "auto", textAlign: "center" }}
                        onClick={() => {
                            let form = {
                                alias: alias,
                                title: title,
                                description: description,
                                items: data.map((item, i) => {
                                    const newItem = {
                                        id: i,
                                        title: item.value,
                                        type: item.type,
                                        required: item.required,
                                    };

                                    if (item.options?.length > 0) {
                                        newItem.options = item.options.map(
                                            (option, i) => ({
                                                id: i,
                                                title: option.value,
                                                type: option.type,
                                                required: option.required
                                            })
                                        );
                                    }

                                    if (item.children?.length > 0) {
                                        let newOpts = item.children.map(
                                            (child, i) => {
                                                return {
                                                    id: item.options?.length > 0 ? item.options?.length + i : i,
                                                    title: child.value,
                                                    required: child.required,
                                                    type: child.type,
                                                    options: child.options?.map(
                                                        (option, i) => ({
                                                            id: i,
                                                            title: option.value,
                                                            type: option.type,
                                                            required: option.required
                                                        })
                                                    )
                                                }
                                            }
                                        )
                                        if (item.options?.length > 0) {
                                            newItem.options = [...item.options, ...newOpts]
                                        } else {
                                            newItem.options = newOpts
                                        }
                                    }

                                    return newItem;
                                }),
                            };
                            onSave(form)
                                .then(() => {
                                    enqueueSnackbar("Форма сохранена", {
                                        variant: "success",
                                    });
                                    navigate("/admin");
                                })
                                .catch((err) => {
                                    enqueueSnackbar("Ошибка сохранения", {
                                        variant: "error",
                                    });
                                    console.error(err);
                                });
                        }}>
                        Сохранить
                    </Button>
                </Box>
            </Box>
        </Fragment>
    );
};
export default FormBuilder;
