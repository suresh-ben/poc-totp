"use client";
import User from "@/config/types/User";
import { createContext, useState } from "react";

const defaultUserData: User = {
    name: "",
    email: "",
    password: "",
    id: "",
};

type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType>({
    user: defaultUserData,
    setUser: () => {},
});

export const UserContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User>(defaultUserData);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
