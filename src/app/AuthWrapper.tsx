"use client";

import { useState, useEffect } from "react";
import { getUserDetails } from "@/actions/user";
import useUser from "@/hooks/useUser";

export default function AuthWrapper({
    currentPath = "",
    children,
}: {
    currentPath?: string;
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const { setUser } = useUser();

    useEffect(() => {
        (async () => {
            try {
                const userDetails = await getUserDetails();
                setUser(userDetails);
                setIsLoading(false);

                console.log(userDetails, "Hii??");

                if (currentPath?.includes("auth")) window.location.href = "/";
            } catch (error) {
                console.error(error);
                if (!currentPath?.includes("auth"))
                    window.location.href = "/auth/login";
                else setIsLoading(false);
            }
        })();
    }, [currentPath, setUser]);

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <p>Loading...</p>
            </div>
        );
    }

    return <>{children}</>;
}
