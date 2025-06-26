import { JsonDB, Config } from "node-json-db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import User from "@/config/types/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    var db = new JsonDB(new Config("myDataBase", true, true, "/"));

    const { name, email, password } = await req.json();

    try {
        const id = uuidv4();

        const user: User = {
            id,
            name,
            email,
            password,
        };

        try {
            const existingUser: User = await db.getData(`/users/${email}`);
            if (existingUser) {
                return NextResponse.json(
                    { message: "User already exists" },
                    { status: 400 }
                );
            }
        } catch (error) {
            console.error(error);
        }

        await db.push(`/users/${email}`, user);
        await db.save();

        const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
        const token = jwt.sign({ email }, jwt_secret, { expiresIn: "1h" });

        const response = NextResponse.json(
            { message: "User registered successfully" },
            { status: 200 }
        );
        response.headers.set(
            "Set-Cookie",
            `token=${JSON.stringify({
                token,
                signed: true,
            })}; HttpOnly; Path=/; Max-Age=3600`
        );
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "User registration failed" },
            { status: 500 }
        );
    }
}
