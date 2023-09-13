import { useEffect, useState } from "react";
import { FormService } from "../../services/FormService";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";

import Button from '@mui/material/Button';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridClearIcon,
    ruRU
} from '@mui/x-data-grid';
import uuid from "react-uuid";

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = uuid();
        setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Новая строка
            </Button>
        </GridToolbarContainer>
    );
}

const makeId = (title, i) => {
    return `${title}_${i}`
}
const makeMultiId = (title, i, j) => {
    return `${makeId(title, i)}_${j}`
}
const parseId = (id) => {
    let split = id.split("_")
    return {
        title: split[0],
        i: split[1],
        j: split[2]
    }
}

function AnswersPage() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    const [columns, setColumns] = useState([]);
    const [columnGroupingModel, setColumnGroupingModel] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const { enqueueSnackbar } = useSnackbar();

    const { formId } = useParams();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAnswers = async () => {
            try {
                const data = await FormService.getAnswers(formId);
                if (isMounted && data.length) {
                    let answers = data.map((answer) => answer.items)
                    setRows(
                        answers.map((answer, i) => {
                            let res = answer.sort((a, b) => a.id - b.id).reduce((rows, a, i) => {
                                if (a.type === "multi") {
                                    a.value.forEach((multiItem, index) => {
                                        rows[makeMultiId(multiItem.title, i, index)] = multiItem.value;
                                    });
                                } else {
                                    rows[makeId(a.title, i)] = a.value;
                                }
                                return rows
                            }, {});
                            res.id = i;
                            res.externalId = data[i].id
                            return res;
                        })
                    );

                    let cols = [];
                    let groups = [];
                    data[0].items.forEach((item, i) => {
                        if (item.type === "multi") {
                            let group = {
                                externalId: i,
                                headerName: item.title,
                                groupId: makeId(item.title, i),
                                children: []
                            }
                            item.value.forEach((subItem, j) => {
                                group.children.push({ field: makeMultiId(subItem.title, i, j) })
                                const subFieldObj = {
                                    field: makeMultiId(subItem.title, i, j),
                                    headerName: subItem.title,
                                    editable: true,
                                    flex: 1,
                                    externalType: subItem.type
                                };
                                cols.push(subFieldObj);
                            });
                            groups.push(group)
                        } else {
                            const fieldObj = {
                                field: makeId(item.title, i),
                                headerName: item.title,
                                editable: true,
                                flex: 1,
                                externalType: item.type
                            };
                            cols.push(fieldObj);
                        }
                    });

                    cols.push({
                        field: 'Действия',
                        type: 'actions',
                        headerName: '',
                        width: 20,
                        cellClassName: 'actions',
                        flex: 1,
                        getActions: ({ id, row }) => {
                            return [
                                <GridActionsCellItem
                                    icon={<GridClearIcon />}
                                    label="Delete"
                                    onClick={() => handleDeleteClick(id, row)}
                                    color="inherit"
                                />,
                            ];
                        },
                    })
                    setColumns(cols);
                    setColumnGroupingModel(groups)
                }
            } catch (err) {
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

    const handleDeleteClick = (id, row) => {
        FormService.deleteAnswer(row.externalId)
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const processRowUpdate = async (newRow) => {
        const processedColumns = []
        const items = columnGroupingModel.map((item, index) => {
            let { title, i } = parseId(item.groupId)
            return {
                id: i,
                title: title,
                type: "multi",
                value: item.children.map((child, index) => {
                    let type = columns.find((v, i) => v.field == child.field).externalType
                    let value = newRow[child.field]
                    processedColumns.push(child.field)
                    let { title, i, j } = parseId(child.field)
                    return {
                        id: j,
                        title: title,
                        value: type == "checkbox" && typeof (value) != "object" ? value?.split(",").map(v => v.trim()) : value,
                        type: type
                    }
                })
            }
        })

        // let len = items.length
        columns.forEach((v, index) => {
            if (processedColumns.includes(v.field) || v.field == "actions") {
                // len--
                return
            }
            let type = v.externalType
            let value = newRow[v.field]
            let { title, i } = parseId(v.field)
            let item = {
                id: i,
                title: title,
                value: type == "checkbox" && typeof (value) != "object" ? value?.split(",").map(v => v.trim()) : value,
                type: type
            }
            items.push(item)
        })

        if (newRow.externalId) {
            FormService.updateAnswer({
                items: items
            }, newRow.externalId)
        } else {
            let newRowId = await FormService.answer({
                answers: [{
                    form_id: formId,
                    items: items
                }]
            })
            newRow.externalId = newRowId
        }

        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
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

    return (
        <Box
            sx={{
                height: "100%",
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                // onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(err) => enqueueSnackbar("Ошибка сохранения", {
                    variant: "error",
                })}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                experimentalFeatures={{ columnGrouping: true }}
                columnGroupingModel={columnGroupingModel}
            />
        </Box>
    );
}
export default AnswersPage;
