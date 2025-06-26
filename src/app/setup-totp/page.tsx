"use client";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import QrCode from "./components/QrCode";
import { requestTotpSecret } from "@/actions/auth";
import { verifyTotp } from "@/actions/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function page(): JSX.Element {
    const router = useRouter();

    const [secret, setSecret] = useState<string>("");
    const [totp, setTotp] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateNewSecret = async () => {
        try {
            setIsLoading(true);
            const { secretUrl } = await requestTotpSecret();
            setSecret(secretUrl);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to generate secret"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            generateNewSecret();
        })();
    }, []);

    const verifyTotpSetup = async () => {
        try {
            setIsLoading(true);
            await verifyTotp(totp);
            toast.success("Successfully verified totp");

            router.push("/");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to verify totp"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col sm:flex-row">
            {isLoading && <Loader />}
            <div className="w-full sm:w-[15rem] border-r border-black p-4">
                <Link className="underline text-blue-500" href="/">
                    Home
                </Link>
            </div>
            <div className="flex flex-col flex-1 p-6 gap-4">
                <p className="text-2xl">Setup/Reset an Authenticator App</p>

                <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
                    <p>Scan the QR code below using an authenticator app</p>

                    <QrCode secret={secret} />

                    <input
                        className="p-2 text-center border border-black w-[25rem] text-lg"
                        type="number"
                        placeholder="Enter the code from your authenticator app"
                        value={totp}
                        onChange={(e) => setTotp(e.target.value)}
                    />

                    <button
                        onClick={generateNewSecret}
                        className="underline text-blue-500"
                    >
                        Generate a new secret
                    </button>

                    <p>Enter the code from your authenticator app to verify</p>

                    <div className="flex gap-2 flex-col w-[25rem]">
                        <button
                            onClick={verifyTotpSetup}
                            className="bg-orange-400 p-2"
                        >
                            Verify
                        </button>

                        <button
                            onClick={() => (window.location.href = "/")}
                            className="bg-gray-400 p-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
