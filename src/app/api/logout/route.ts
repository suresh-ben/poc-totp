import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // remove token from cookies
        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        response.headers.set("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
}