import React from "react";
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {TimePicker, DatePicker} from "@mui/x-date-pickers";
import Grid from '@mui/material/Grid2';
import dayjs from "dayjs";
import {Entry} from "../../hooks/useStore";


type DialogFormCreateProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    addEntry: () => void;
    form: any;
    setForm: (form: any) => void;
    defaultForm: Entry;
    isEditing: boolean;
    setEditing: (isEditing: boolean) => void;
}
const DialogFormCreate: React.FC<DialogFormCreateProps> = ({ defaultForm, setEditing, open, setOpen, setForm, addEntry, form, }) => {
    return (
        <Dialog open={open} onClose={() => {

            setOpen(false)
            setEditing(false)
            setForm(defaultForm)
        }}>

            <DialogTitle>Add Time Entry</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} mt={2}>
                    <Grid size={{xs: 12}}>
                        <DatePicker
                            sx={{width: "100%"}}
                            label="Date"
                            value={dayjs(form.date)}
                            onChange={(newValue) => setForm({...form, date: newValue ?? undefined})}
                        />
                    </Grid>


                    <Grid size={{xs: 12}}>
                        <TimePicker
                            sx={{width: "100%"}}
                            label="Start Time"
                            value={dayjs(form.startTime)}

                            onChange={(newValue) => setForm({...form, startTime: newValue ?? undefined})}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <TimePicker
                            sx={{width: "100%"}}
                            label="End Time"
                            value={dayjs(form.endTime)}
                            onChange={(newValue) => setForm({...form, endTime: newValue ?? undefined})}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>

                        <TextField

                            label="Lunch (hours)" type="number" value={form.lunch}
                            onChange={(e) => setForm({lunch: e.target.value})} fullWidth/>
                    </Grid>

                    <Grid size={{xs: 12}}>

                        <TextField
                            inputProps={{
                                maxLength: 100, // максимальна довжина 2 символи
                            }}
                            label="Work With" value={form.workWith}
                            onChange={(e) => setForm({workWith: e.target.value})}
                            fullWidth/>
                    </Grid>

                    <Grid size={{xs: 12}}>

                        <TextField
                            inputProps={{
                                maxLength: 300, // максимальна довжина 2 символи
                            }}
                            multiline
                            rows={5}
                            label="Job Name & Description" value={form.jobDescription}
                            onChange={(e) => setForm({jobDescription: e.target.value})}
                            fullWidth/>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setEditing(false)
                    setOpen(false)
                }}>Cancel</Button>
                <Button onClick={addEntry} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogFormCreate;