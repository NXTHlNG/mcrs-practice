import { Routes, Route } from "react-router-dom";
import FormBuilder from "@components/FormBuilder";
import MainPage from "./components/MainPage/MainPage";
import AnswersPage from "./components/AnswersPage/AnswersPage";
import FormPage from "./components/FormPage/FormPage";
import FormResponse from "./components/FormPage/FormResponse";
import IndexPage from "./components/IndexPage/IndexPage";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import { FormService } from "./services/FormService";
import "react-nestable/dist/styles/index.css";

const App = () => {
    return (
        <Routes>
            <Route path="*" element={<NotFoundPage />}></Route>
            <Route path="/" element={<IndexPage />}></Route>
            <Route path="/admin" element={<MainPage />} />
            <Route
                path="/admin/form/edit/:alias"
                element={<FormBuilder onSave={FormService.update} />}
            />
            <Route
                path="/admin/form/create"
                element={<FormBuilder onSave={FormService.create} />}
            />
            <Route
                path="/admin/form/answers/:formId"
                element={<AnswersPage />}
            />
            <Route path="/form/:alias" element={<FormPage />} />
            <Route path="/form/response/:alias" element={<FormResponse />} />
        </Routes>
    );
};

export default App;
