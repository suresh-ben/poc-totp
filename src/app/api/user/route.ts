import { NextResponse } from "next/server";
import User from "@/config/types/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { User as UserModel } from "@/models/User";

export async function GET() {
    try {
        await connectToDatabase();

        //get the token from cookies and get user from db
        const cookieStore = await cookies();
        const _token = cookieStore.get("token")?.value;
        const { token, signed } = JSON.parse(_token || "{}");

        if (!signed) {
            return NextResponse.json(
                { message: "Unauthorized. Token not signed" },
                { status: 401 }
            );
        }

        // read token using jwt
        const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
        const { email } = jwt.verify(token, jwt_secret) as { email: string };

        const user: (User | null) = await UserModel.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to get user" },
            { status: 500 }
        );
    }
}
