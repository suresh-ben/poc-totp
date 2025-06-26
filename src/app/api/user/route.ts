import { JsonDB, Config } from "node-json-db";
import { NextResponse } from "next/server";
import User from "@/config/types/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    var db = new JsonDB(new Config("myDataBase", true, true, "/"));

    try {
        //get the token from cookies and get user from db
        const cookieStore = await cookies();
        const _token = cookieStore.get("token")?.value;
        const { token, signed } = JSON.parse(_token || "{}");

        if (!signed) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // read token using jwt
        const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
        const { email } = jwt.verify(token, jwt_secret) as { email: string };

        const user: User = await db.getData(`/users/${email}`);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to get user" },
            { status: 500 }
        );
    }
}
