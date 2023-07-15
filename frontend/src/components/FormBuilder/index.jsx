import { Fragment, useState, useEffect } from "react";
import uuid from "react-uuid";
import Nestable from "react-nestable";
//Material UI Components
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
//Form Elements
import {
    TextFieldInput,
    TextArea,
    NumberInput,
    RadioInput,
    DateInput,
    TimeInput,
} from "./elements";
import Layout from "./elements/layout";
import { formEl } from "./constants.js";
//Components
import Header from "./Header";
import { useParams } from "react-router-dom";
import { Button, Box } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import { FormService } from "../../services/FormService";

const FormBuilder = ({ onSave }) => {
    const initVal = formEl[0]?.value;

    //State
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState("text");

    const items = data;
    const { alias } = useParams();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getForm = async () => {
            try {
                const data = await FormService.get(alias);
                console.log(data);
                if (isMounted) {
                    setTitle(data.title);
                    setDescription(data.description);
                    console.log("xxxx " + title);
                    console.log("xxxx " + description);
                    setData(
                        data.items.map((item) => {
                            const newItem = {
                                id: uuid(),
                                value: item.title,
                                type: item.type,
                                required: item.required,
                                options: item.options?.map((option) => {
                                    let newOption = {
                                        id: uuid(),
                                        value: option.value,
                                    };
                                    return newOption;
                                }),
                            };
                            return newItem;
                        })
                    );
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
    console.log("in render " + title);

    useEffect(() => {
        console.log("---");
        console.log(title);
        console.log("---");
    }, [title]);

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

    //Function to delete element
    const deleteEl = (id) => {
        setData((prevState) => prevState.filter((val) => val.id !== id));
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

    //Function to Handle Input Values
    const handleValue = (id, e) => {
        let newArr = data.map((el) => {
            if (el.id == id) {
                return { ...el, value: e.target.value };
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Function to Handle Required
    const handleRequired = (id) => {
        let newArr = data.map((el) => {
            if (el.id == id) {
                return { ...el, required: !el.required };
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Function to Handle Element Type
    const handleElType = (id, type) => {
        let newArr = data.map((el) => {
            if (el.id == id) {
                return { ...el, type: type };
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Function to Handle Options
    const addOption = (id, newOption) => {
        let newArr = data.map((el) => {
            if (el.id == id) {
                const objVal = "options" in el ? el?.options : [];
                return { ...el, options: [...objVal, newOption] };
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Function to Handle Date
    const handleDate = (id, dateVal) => {
        let newArr = data.map((el) => {
            if (el.id == id) {
                return { ...el, date: dateVal };
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Function to Handle Time
    const handleTime = (id, dateVal) => {
        let newArr = data.map((el) => {
            if (el.id == id) {
                return { ...el, time: dateVal };
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Function to Change Option Values
    const handleOptionValues = (elId, optionId, optionVal) => {
        let newArr = data.map((el) => {
            if (el.id == elId) {
                el?.options &&
                    el?.options.map((opt) => {
                        if (opt.id == optionId) {
                            opt.value = optionVal;
                        }
                    });
                return el;
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Function to Delete Optin
    const deleteOption = (elId, optionId) => {
        let newArr = data.map((el) => {
            if (el.id == elId) {
                let newOptions =
                    el?.options &&
                    el?.options.filter((opt) => opt.id != optionId);
                return { ...el, options: newOptions };
            } else {
                return el;
            }
        });
        setData(newArr);
    };

    //Render items
    const renderElements = ({ item }) => {
        switch (item.type) {
            case "text":
                return (
                    <TextFieldInput
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
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        handleTime={handleTime}
                        duplicateElement={duplicateElement}
                    />
                );
            default:
                return <Fragment></Fragment>;
        }
    };

    console.log(data);

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
                            items={items}
                            renderItem={renderElements}
                            maxDepth={1}
                            onChange={handleOnChangeSort}
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
                                title: title,
                                description: description,
                                items: data.map((item, i) => {
                                    const newItem = {
                                        id: i,
                                        title: item.value,
                                        type: item.type,
                                    };

                                    if (item.options?.length > 0) {
                                        newItem.options = item.options.map(
                                            (option, i) => ({
                                                id: i,
                                                value: option.value,
                                            })
                                        );
                                    }

                                    return newItem;
                                }),
                            };

                            console.log(form);

                            onSave(form);
                        }}>
                        Сохранить
                    </Button>
                </Box>
            </Box>
        </Fragment>
    );
};
export default FormBuilder;
