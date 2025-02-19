import React from "react";
import { Button } from "@mui/material";
import useStore from "../../hooks/useStore";

const ResetButton: React.FC = () => {
    const resetList = async () => {
        await useStore.persist.clearStorage();
        useStore.setState({ entries: [] });
    };

    return (
        <Button variant="contained" color="primary" onClick={resetList}>
            Reset List
        </Button>
    );
};

export default ResetButton;
