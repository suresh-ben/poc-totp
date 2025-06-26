import User from "@/config/types/User";
import { JsonDB, Config } from "node-json-db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    var db = new JsonDB(new Config("myDataBase", true, true, "/"));

    const { email, password } = await req.json();

    try {
        const user: User = await db.getData(`/users/${email}`);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        if (user.password !== password) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        // create a token of user and store it in a cookie
        const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
        const token = jwt.sign({ email }, jwt_secret, { expiresIn: "1h" });

        const response = NextResponse.json(
            { message: "Login successful, need to verify by TOTP" },
            { status: 200 }
        );
        response.headers.set(
            "Set-Cookie",
            `token=${JSON.stringify({
                token,
                signed: false,
            })}; HttpOnly; Path=/; Max-Age=3600`
        );
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    }
}
