import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:8069"
});

export default api;