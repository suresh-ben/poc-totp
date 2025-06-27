import User from "@/config/types/User";
import Secret from "@/config/types/Secret";
import { connectToDatabase } from "@/lib/mongodb";
import { User as UserModel } from "@/models/User";
import { Secret as SecretModel } from "@/models/Secret";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import speakEasy from "speakeasy";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { totp } = await req.json();

        //get the token from cookies and get user from db
        const cookieStore = await cookies();
        const _token = cookieStore.get("token")?.value;
        const { token } = JSON.parse(_token || "{}");

        // read token using jwt
        const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
        const { email } = jwt.verify(token, jwt_secret) as { email: string };

        const user: (User | null) = await UserModel.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const secret: (Secret | null) = await SecretModel.findOne({ email });
        if(!secret) return NextResponse.json({ message: "TOTP is not found. You wont be able to login, Please contact admin." }, { status: 404 });

        const verified = speakEasy.totp.verify({
            secret: secret.secret,
            encoding: "base32",
            token: totp,
            window: 1,
        });

        if (verified) {
            // create a token of user and store it in a cookie
            const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
            const token = jwt.sign({ email }, jwt_secret, { expiresIn: "1h" });

            const response = NextResponse.json(
                { message: "Login successful", user },
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
        } else {
            return NextResponse.json(
                { message: "Invalid TOTP" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong, please try again" },
            { status: 401 }
        );
    }
}
