"use client";
import { JSX } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useState } from "react";
import { login as loginAction, verifyLogin as verifyLoginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import Loader from "@/components/Loader";

export default function page(): JSX.Element {

    const router = useRouter();
    const { setUser } = useUser();

    const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [totp, setTotp] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!email || !password) {
                toast.error("Please fill all the fields");
                return;
            }

            setIsLoading(true);
            await loginAction(email, password);
            setIsPasswordVerified(true);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "User login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const verifyTotp = async () => {
        try {
            setIsLoading(true);
            const { user } = await verifyLoginAction(totp);
            setUser(user);
            router.push("/");

            toast.success("Successfully logged in");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "User login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {isLoading && <Loader />}
            <div className="p-6 bg-white rounded-2xl shadow-2xl">
                {!isPasswordVerified && (
                    <form
                        className="flex flex-col justify-center items-center gap-6"
                        onSubmit={login}
                    >
                        <h1 className="veots text-3xl font-bold">Login Form</h1>

                        <input
                            placeholder="Email address *"
                            className="p-2 border-b-2 border-emerald-400 w-[25rem]"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            placeholder="Password *"
                            className="p-2 border-b-2 border-emerald-400 w-[25rem]"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button className="bg-indigo-500 text-white p-2 w-[20rem]">
                            Login
                        </button>
                    </form>
                )}
                {isPasswordVerified && (
                    <div className="flex flex-col justify-center items-center gap-6">
                        <h1 className="veots text-3xl font-bold">Login Form</h1>

                        <p>Please enter the code from your authenticator app</p>

                        <input
                            className="p-2 text-center border border-black w-[25rem] text-lg"
                            type="number"
                            placeholder="Enter the code from your authenticator app"
                            value={totp}
                            onChange={(e) => setTotp(e.target.value)}
                        />

                        <div className="flex gap-2 flex-col w-[25rem]">
                            <button
                                onClick={verifyTotp}
                                className="bg-orange-400 p-2"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-center items-center text-md mt-2">
                    <p>Don&apos;t have an account?</p>
                    <Link
                        className="underline text-blue-500"
                        href="/auth/register"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
