import axios from "@/lib/api";

export const getUserDetails = async () => {
    try {
        const res = await axios.get("/user");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}