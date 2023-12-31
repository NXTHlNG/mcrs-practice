import axios from "axios";

let baseURL;

if (window.location.origin === "http://localhost:3000") {
    baseURL = "http://localhost:8000";
} else {
    baseURL = window.location.origin;
}

baseURL = baseURL + "/api";

axios.defaults.auth = {
    username: process.env.REACT_APP_BASIC_AUTH_USER,
    password: process.env.REACT_APP_BASIC_AUTH_PASSWORD,
};

export const FormService = {
    async getAll() {
        const res = await axios.get(`${baseURL}/form`);
        return res.data;
    },

    async get(alias) {
        const res = await axios.get(`${baseURL}/form/${alias}`);
        return res.data;
    },

    async getAnswers(formId) {
        const res = await axios.get(`${baseURL}/answer/${formId}`);
        console.log(res.data)
        return res.data;
    },

    async delete(alias) {
        const res = await axios.delete(`${baseURL}/form/${alias}`);
        return res.data;
    },

    async create(form) {
        console.log(form)
        const res = await axios.post(`${baseURL}/form`, form);
        return res.data;
    },

    async update(form) {
        const res = await axios.put(`${baseURL}/form/${form.alias}`, form);
        return res.data;
    },

    async answer(data) {
        console.log(data)
        const res = await axios.post(`${baseURL}/answer/all`, data);
        return res.data;
    },

    async updateAnswer(data, answerId) {
        const res = await axios.put(`${baseURL}/answer/${answerId}`, data);
        return res.data;
    },

    async deleteAnswer(answerId) {
        const res = await axios.delete(`${baseURL}/answer/${answerId}`);
        return res.data;
    },

    async download(formId) {
        const res = await axios.get(`${baseURL}/statistics/${formId}`, {
            responseType: "blob",
        });
        const href = window.URL.createObjectURL(res.data);

        const anchorElement = document.createElement("a");

        anchorElement.href = href;
        anchorElement.download = formId;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);

        return res.data;
    },
};
