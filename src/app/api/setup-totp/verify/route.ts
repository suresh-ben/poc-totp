import { JsonDB, Config } from "node-json-db";
import { NextResponse } from "next/server";
import User from "@/config/types/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import speakEasy from "speakeasy";

export async function POST(req: Request) {
    var db = new JsonDB(new Config("myDataBase", true, true, "/"));

    const { totp } = await req.json();

    try {
        //get the token from cookies and get user from db
        const cookieStore = await cookies();
        const _token = cookieStore.get("token")?.value;
        const { token } = JSON.parse(_token || "{}");

        // read token using jwt
        const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
        const { email } = jwt.verify(token, jwt_secret) as { email: string };

        const user: User = await db.getData(`/users/${email}`);
        if (!user)
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );

        const temp_secret = await db.getData(
            `/users/${email}/totp/temp-secret`
        );

        const verified = speakEasy.totp.verify({
            secret: temp_secret,
            encoding: "base32",
            token: String(totp),
            window: 1,
        });

        if (verified) {
            await db.push(`/users/${email}/totp/secret`, temp_secret, true);
            await db.delete(`/users/${email}/totp/temp-secret`);
            await db.save();
            return NextResponse.json(
                { message: "TOTP setup successful" },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Invalid TOTP" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "TOTP verification failed" },
            { status: 500 }
        );
    }
}
