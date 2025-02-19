import {Alert, Button, Input, Snackbar} from "@mui/material";
import React, {useState} from "react";
import styles from "./styles.module.css";
import Grid from "@mui/material/Grid2";
import ResetButton from "../ResetButton";

type TechButtonsProps = {
    setOpen: (open: boolean) => void;
    exportPDF: () => void;
    setName: (name: string) => void;
    name: string;
}

const TechButtons: React.FC<TechButtonsProps> = ({exportPDF, setOpen, name, setName}) => {
    const [errorOpen, setErrorOpen] = useState(false);

    const handleExportPDF = () => {
        // Якщо поле "Full Name" не заповнене
        if (!name || name.trim() === "") {
            setErrorOpen(true);
            return;
        }
        // Інакше експортуємо PDF
        exportPDF();
    };

    const handleClose = (event?: any, reason?: any) => {
        if (reason === "clickaway") {
            return;
        }
        setErrorOpen(false);
    };



    return (
        <div className={styles.container}>
            <Grid container spacing={2} sx={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px 0"
            }}>
                <Grid size={{xs: 12, sm: 4, md: 4}}>
                    <Input
                        inputProps={{
                            maxLength: 30,
                        }}
                        sx={{
                            width: "100%"
                        }}
                        placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}/>
                </Grid>
                <Grid size={{xs: 12, sm: 4, md: 4}}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setOpen(true)}> + Add date</Button>
                </Grid>
                <Grid size={{xs: 12, sm: 4, md: 4}}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleExportPDF} >Export PDF</Button>
                </Grid>
            </Grid>
            <ResetButton/>

            <Snackbar
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                open={errorOpen}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                    Full Name is required!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default TechButtons;