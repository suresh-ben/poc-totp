import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User as UserModel } from "@/models/User";
import User from "@/config/types/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { name, email, password } = await req.json();

        const existingUser: User | null = await UserModel.findOne({ email });
        if (existingUser)
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );

        // save user to database
        const user = await UserModel.create({
            name,
            email,
            password,
        });
        await user.save();

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
