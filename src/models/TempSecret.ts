import { Schema, models, model } from "mongoose";

const TempSecretSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        secret: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const TempSecret = models.TempSecret || model("TempSecret", TempSecretSchema);
