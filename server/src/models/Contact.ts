import { Schema, model, Types, type InferSchemaType } from "mongoose";

export const CONTACT_TYPES = ["personal", "professional"] as const;

const contactSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    type: { type: String, enum: CONTACT_TYPES, default: "personal" },
  },
  { timestamps: true },
);

export type ContactDoc = InferSchemaType<typeof contactSchema>;
export const Contact = model("Contact", contactSchema);
