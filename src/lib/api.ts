import axios from "axios";

const APP_URL = process.env.APP_URL || "";
console.log(APP_URL);

export const axiosInstance = axios.create({
    baseURL: APP_URL + "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;