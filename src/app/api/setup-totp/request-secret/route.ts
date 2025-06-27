import { NextResponse } from "next/server";
import User from "@/config/types/User";
import speaskEasy from "speakeasy";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { User as UserModel } from "@/models/User";
import { TempSecret as TempSecretModel } from "@/models/TempSecret";

export async function GET() {

    try {
        await connectToDatabase();

        const temp_secret = speaskEasy.generateSecret({
            name: "Veots",
            issuer: "Veots",
        });
        const secret = temp_secret.base32;

        //get the token from cookies and get user from db
        const cookieStore = await cookies();
        const _token = cookieStore.get("token")?.value;
        const { token } = JSON.parse(_token || "{}");

        // read token using jwt
        const jwt_secret: string = process.env.COOKIE_SECRET || "Secret";
        const { email } = jwt.verify(token, jwt_secret) as { email: string };

        const user: (User | null) = await UserModel.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        await TempSecretModel.findOneAndUpdate({ email }, { $set: {secret} }, { upsert: true, new: true });

        return NextResponse.json(
            { secretUrl: temp_secret.otpauth_url },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to generate secret" },
            { status: 500 }
        );
    }
}
