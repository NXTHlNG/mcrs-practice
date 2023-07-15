import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import FormBuilder from "@components/FormBuilder";
import MainPage from "./components/MainPage/MainPage";
import FormPage from "./components/FormPage/FormPage";
import { FormService } from "./services/FormService";
import "react-nestable/dist/styles/index.css";
const App = () => {
    return (
        <Routes>
            <Route path="" element={<MainPage />} />
            <Route
                path="/form/edit/:alias"
                element={<FormBuilder onSave={FormService.update} />}
            />
            <Route
                path="/form/create"
                element={<FormBuilder onSave={FormService.create} />}
            />
            <Route path="/form/*" element={<FormPage />} />
        </Routes>
    );
};

export default App;
