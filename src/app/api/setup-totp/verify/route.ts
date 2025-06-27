import { NextResponse } from "next/server";
import User from "@/config/types/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import speakEasy from "speakeasy";
import { connectToDatabase } from "@/lib/mongodb";
import { User as UserModel } from "@/models/User";
import { TempSecret as TempSecretModel } from "@/models/TempSecret";
import { Secret as SecretModel } from "@/models/Secret";
import Secret from "@/config/types/Secret";

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

        const temp_secret: Secret | null = await TempSecretModel.findOne({ email });
        if (!temp_secret) return NextResponse.json({ message: "Unable to verify TOTP. Please generate a new secret" }, { status: 404 });

        const verified = speakEasy.totp.verify({
            secret: temp_secret.secret,
            encoding: "base32",
            token: String(totp),
            window: 1,
        });

        if (verified) {
            await TempSecretModel.deleteOne({ email });
            await SecretModel.findOneAndUpdate({ email }, { secret: temp_secret.secret }, { upsert: true });

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
