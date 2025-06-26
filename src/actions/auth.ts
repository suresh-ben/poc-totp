import axios from "@/lib/api";

export const register = async (name: string, email: string, password: string) => {
    try {
        const res = await axios.post("/register", {
            name,
            email,
            password
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const logout = async () => {
    try {
        const res = await axios.post("/logout");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const requestTotpSecret = async () => {
    try {
        const res = await axios.get("/setup-totp/request-secret");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const verifyTotp = async (code: string) => {
    try {
        const res = await axios.post("/setup-totp/verify", {
            totp: code
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const login = async (email: string, password: string) => {
    try {
        const res = await axios.post("/login", {
            email,
            password
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const verifyLogin = async (totp: string) => {
    try {
        const res = await axios.post("/login/verify", {
            totp
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}