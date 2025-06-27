import { Schema, models, model } from "mongoose";

const SecretSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        secret: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const Secret = models.Secret || model("Secret", SecretSchema);
