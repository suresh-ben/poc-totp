"use client";
import { useState } from "react";
import Link from "next/link";
import { JSX } from "react";
import { register as registerAction } from "@/actions/auth";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

export default function Page(): JSX.Element {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [check, setCheck] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const register = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (!name || !email || !password) {
                toast.error("Please fill all the fields");
                return;
            }

            if (!check) {
                toast.error("Please agree to the terms and conditions");
                return;
            }

            setIsLoading(true);
            await registerAction(name, email, password);
            window.location.href = "/";
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "User registration failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {isLoading && <Loader />}
            <div className="p-6 bg-white rounded-2xl shadow-2xl">
                <form
                    className="flex flex-col justify-center items-center gap-6"
                    onSubmit={register}
                >
                    <h1 className="veots text-3xl font-bold">
                        Registration Form
                    </h1>

                    <input
                        placeholder="Name *"
                        className="p-2 border-b-2 border-emerald-400 w-[25rem]"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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

                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={check}
                            onClick={() => setCheck((val) => !val)}
                        />
                        <p className="text-sm">
                            I agree to the terms and conditions
                        </p>
                    </div>

                    <button className="bg-indigo-500 text-white p-2 w-[20rem]">
                        Register
                    </button>
                </form>

                <div className="flex justify-center items-center text-md mt-2">
                    <p>Already have an account?</p>
                    <Link
                        className="underline text-blue-500"
                        href="/auth/login"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
