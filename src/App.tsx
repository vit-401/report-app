import React, {useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "jspdf-autotable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./styles.module.css";

import {DataGrid, GridColDef} from "@mui/x-data-grid";
import TechButtons from "./components/TechButtons";
import DialogFormCreate from "./components/DialogFormCreate";
import {IconButton, TextField, Tooltip} from "@mui/material";

import useStore from "./hooks/useStore";
import CustomTooltip from "./components/Tooltip";


const editEntry = ({id}: any) => {


    const entry = useStore.getState().entries.find((entry) => entry.id === id);
    if (entry) {
        useStore.getState().setForm(entry);
        useStore.getState().setOpen(true);
        useStore.getState().setEditing(true);
    }
}






const columns: GridColDef[] = [
    {
        sortComparator: (v1, v2) => dayjs(v1).diff(dayjs(v2)),
        align: "left",
        minWidth: 130,
        headerAlign: "left",
        flex: 1,
        field: "date",
        headerName: "Date",
        width: 100,
        valueGetter: (params) =>
            params ? dayjs(params).format("YYYY-MM-DD") : "",
        renderCell: (params) => (
            <CustomTooltip   title={params.value || ""}>
                <span>{params.value}</span>
            </CustomTooltip>
        )
    },
    {
        sortComparator: (v1, v2) => dayjs(v1, "HH:mm").diff(dayjs(v2, "HH:mm")),
        align: "center",
        minWidth: 150,
        flex: 1,
        headerAlign: "center",
        field: "startTime",
        headerName: "Start Time",
        width: 100,
        valueGetter: (params) =>
            params ? dayjs(params).format("HH:mm") : "",
        renderCell: (params) => (
            <CustomTooltip  title={params.value || ""}>
                <span>{params.value}</span>
            </CustomTooltip>
        )
    },
    {
        sortComparator: (v1, v2) =>  dayjs(v1, "HH:mm").diff(dayjs(v2, "HH:mm")),
        align: "center",
        minWidth: 150,
        flex: 1,
        headerAlign: "center",
        field: "endTime",
        headerName: "End Time",
        width: 100,
        valueGetter: (params) =>
            params ? dayjs(params).format("HH:mm") : "",
        renderCell: (params) => (
            <CustomTooltip  title={params.value || ""}>
                <span>{params.value}</span>
            </CustomTooltip>
        )
    },
    {
        align: "center",
        field: "lunch",
        minWidth: 150,
        flex: 1,
        headerName: "Lunch (hours)",
        width: 50,
        headerAlign: "center",
        renderCell: (params) => (
            <CustomTooltip title={params.value || ""}>
                <span>{params.value}</span>
            </CustomTooltip>
        )
    },
    {
        align: "center",
        field: "workWith",
        minWidth: 250,
        flex: 1,
        headerName: "Work With",
        headerAlign: "center",
        width: 250,
        renderCell: (params) => (
            <CustomTooltip  title={params.value || ""}>
                <span>{params.value}</span>
            </CustomTooltip>
        )
    },
    {
        align: "center",
        field: "jobDescription",
        minWidth: 400,
        flex: 1,
        headerName: "Job Description",
        headerAlign: "center",
        width: 300,
        renderCell: (params) => (
            <CustomTooltip   title={params.value || ""}>
                <span>{params.value}</span>
            </CustomTooltip>
        )
    },
    {
        align: "center",
        field: "totalHours",
        sortComparator: (v1, v2) => {
            // Функція, що перетворює рядок "5h 40m" на число (годин)
            const parseTime = (timeStr: string): number => {
                // Припустимо, формат завжди "Xh Ym"
                const regex = /(\d+)\s*h\s*(\d+)\s*m/;
                const match = timeStr.match(regex);
                if (match) {
                    const hours = Number(match[1]);
                    const minutes = Number(match[2]);
                    return hours + minutes / 60;
                }
                return 0;
            };

            const num1 = parseTime(v1);
            const num2 = parseTime(v2);
            return num1 - num2;
        },
        minWidth: 150,
        flex: 1,
        headerName: "Total Hours",
        headerAlign: "center",
        width: 130,
        renderCell: (params) => (
            <CustomTooltip title={params.value || ""}>
                <span>{params.value}</span>
            </CustomTooltip>
        )
    },
    {
        disableColumnMenu: true,
        minWidth: 150,
        flex: 1,
        headerAlign: "right",
        field: "actions",
        headerName: "Actions",
        width: 150,
        sortable: false,
        renderCell: (params) => (
            <div>
                <Tooltip title="Edit">
                    <IconButton onClick={() => editEntry(params)} color="primary">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        sx={{ color: "darkred" }}
                        onClick={() => useStore.getState().deleteEntry(+params.id)}
                        color="primary"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        ),
        align: "right"
    }
];




const App: React.FC = () => {
    const {
        name,
        setName,
        entries,
        form,
        open,
        defaultForm,
        setOpen,
        setForm,
        addEntry,
        exportPDF,
        isEditing,
        setEditing
    } = useStore();

    const [searchTerm, setSearchTerm] = useState("");
    const filteredEntries = entries.filter((entry) => {
        const term = searchTerm.toLowerCase();
        const dateString = entry.date ? dayjs(entry.date).format("YYYY-MM-DD") : "";

        return (
            dateString.includes(term) ||
            entry.jobDescription.toLowerCase().includes(term) ||
            entry.workWith.toLowerCase().includes(term) ||
            entry.lunch.toString().includes(term) ||
            entry.totalHours.toString().includes(term)
        );
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.container}>
                <TechButtons name={name} setName={setName} exportPDF={exportPDF} setOpen={setOpen}/>

                <DialogFormCreate defaultForm={defaultForm} setEditing={setEditing}  isEditing={isEditing} form={form} setForm={setForm}
                                  setOpen={setOpen} open={open} addEntry={addEntry}/>

                <TextField
                    label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <div style={{height: 400, width: "100%", marginTop: 20}}>
                    <DataGrid  rows={filteredEntries}
                              columns={columns}
                              pagination
                              pageSizeOptions={[100]}
                              rowSelection
                              disableColumnSelector
                              disableRowSelectionOnClick
                              disableColumnResize
                              getRowHeight={() => 'auto'}
                              sx={{
                                  "& .MuiDataGrid-cell": {
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      lineHeight: "1.2",      // Зменшує відступ між рядками
                                  }
                              }}
                    />
                </div>
            </div>

        </LocalizationProvider>
    );
};

export default App;
