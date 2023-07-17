import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <SnackbarProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <App></App>
                </LocalizationProvider>
            </SnackbarProvider>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
);
