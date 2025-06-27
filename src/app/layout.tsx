import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "@/contexts/useContext";
import AuthWrapper from "./AuthWrapper";
import { headers } from "next/headers";
import TostifyWrapper from "./TostifyWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TOTP MFA POC",
    description: "TOTP MFA POC",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const currentPath = (await headers()).get("x-current-path") || "";

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <UserContextProvider>
                    <AuthWrapper currentPath={currentPath}>
                        {children}
                    </AuthWrapper>
                </UserContextProvider>
                <TostifyWrapper />
            </body>
        </html>
    );
}
