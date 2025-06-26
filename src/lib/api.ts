import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://poc-totp.vercel.app/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
