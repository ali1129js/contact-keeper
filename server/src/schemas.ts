import { z } from "zod";
import { CONTACT_TYPES } from "./models/Contact.js";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Please include a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please include a valid email"),
  password: z.string().min(1, "Password is required"),
});

const optionalText = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please include a valid email")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: optionalText,
  type: z.enum(CONTACT_TYPES).default("personal"),
});

export const contactUpdateSchema = contactSchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
