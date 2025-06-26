import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;