import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../db.js";
import { Contact } from "../models/Contact.js";
import { User } from "../models/User.js";
import { z } from "zod";

// All people below are fictional. Emails use the reserved example.com domain
// and phone numbers use the fictional 555-01xx range.
export const DEMO_USER = { name: "Demo User", email: "demo@example.com", password: "demo-password-123" };

export const DEMO_CONTACTS = [
  { name: "Ada Quill", email: "ada.quill@example.com", phone: "555-0101", type: "professional" },
  { name: "Bram Stoneworth", email: "bram@example.com", phone: "555-0102", type: "personal" },
  { name: "Cleo Marigold", email: "cleo.marigold@example.com", phone: "555-0103", type: "professional" },
  { name: "Dmitri Larkspur", email: "dmitri@example.com", phone: "555-0104", type: "personal" },
  { name: "Esme Fairweather", email: "esme.f@example.com", phone: "555-0105", type: "professional" },
  { name: "Felix Underhill", email: "felix@example.com", phone: "555-0106", type: "personal" },
] as const;

export async function seed(): Promise<void> {
  await User.deleteOne({ email: DEMO_USER.email });
  const user = await User.create({ ...DEMO_USER, password: await bcrypt.hash(DEMO_USER.password, 12) });
  await Contact.deleteMany({ user: user._id });
  await Contact.insertMany(DEMO_CONTACTS.map((c) => ({ ...c, user: user._id })));
}

const isMain = process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js");
if (isMain) {
  const uri = z.string().min(1, "MONGODB_URI is required").parse(process.env.MONGODB_URI);
  await connectDB(uri);
  await seed();
  console.log(`Seeded ${DEMO_CONTACTS.length} fictional contacts for ${DEMO_USER.email}`);
  await disconnectDB();
}
