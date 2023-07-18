import axios from "axios";

export const FormService = {
    async getAll() {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/form`);
        return res.data;
    },

    async get(alias) {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/form/${alias}`
        );
        return res.data;
    },

    async delete(alias) {
        const res = await axios.delete(
            `${process.env.REACT_APP_API_URL}/form/${alias}`
        );
        return res.data;
    },

    async create(form) {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/form`,
            form
        );
        return res.data;
    },

    async update(form) {
        const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/form/${form.alias}`,
            form
        );
        return res.data;
    },

    async answer(data) {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/answer`,
            data
        );
        return res.data;
    },

    async download(alias) {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/download/${alias}`,
            {
                responseType: "blob",
            }
        );
        const href = window.URL.createObjectURL(res.data);

        const anchorElement = document.createElement("a");

        anchorElement.href = href;
        anchorElement.download = alias;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);

        return res.data;
    },
};
