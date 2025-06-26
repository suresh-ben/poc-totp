"use client";
import { JSX, useState } from "react";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { logout as logOutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

export default function Home(): JSX.Element {
    const router = useRouter();
    const { user } = useUser();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const logOut = async () => {
        try {
            setIsLoading(true);
            await logOutUser();
            router.push("/auth/login");

            toast.error("Successfully logged out");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to logout");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col sm:flex-row relative">
            {isLoading && <Loader />}
            
            <div className="absolute top-0 right-0 p-10 text-2xl">
                {user?.name}
            </div>

            <div className="absolute right-0 bottom-0 p-10 text-md">
                <button onClick={logOut} className="underline text-blue-500">
                    Log out
                </button>
            </div>

            <div className="flex flex-col gap-4 w-full sm:w-[15rem] border-r border-black p-4">
                <Link className="underline text-blue-500" href="/setup-totp">
                    Setup/Reset TOTP
                </Link>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center flex-1">
                <p className="text-6xl">
                    Welcome to <span className="font-bold veots">Veots</span>
                </p>

                <div className="flex justify-center items-center gap-2">
                    <p>You wont be able to login without Setup your MFA.</p>
                    <Link
                        className="underline text-blue-500"
                        href="/setup-totp"
                    >
                        Setup TOTP
                    </Link>
                    <p>If you haven&apos;t setup MFA</p>
                </div>
            </div>
        </div>
    );
}
