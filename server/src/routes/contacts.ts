import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Contact } from "../models/Contact.js";
import { contactSchema, contactUpdateSchema } from "../schemas.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

export const DEFAULT_CONTACT_LIMIT = 20;
export const MAX_CONTACT_LIMIT = 100;

export function parsePage(query: { limit?: unknown; offset?: unknown }):
  | { limit: number; offset: number }
  | { error: string } {
  const rawLimit = query.limit;
  const rawOffset = query.offset;
  const limit =
    rawLimit === undefined || rawLimit === "" ? DEFAULT_CONTACT_LIMIT : Number(rawLimit);
  const offset = rawOffset === undefined || rawOffset === "" ? 0 : Number(rawOffset);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_CONTACT_LIMIT) {
    return { error: "limit must be an integer between 1 and 100" };
  }
  if (!Number.isInteger(offset) || offset < 0) {
    return { error: "offset must be an integer of 0 or more" };
  }
  return { limit, offset };
}

export function contactsRouter(jwtSecret: string): Router {
  const router = Router();
  router.use(requireAuth(jwtSecret));

  router.get("/", async (req, res) => {
    const page = parsePage(req.query);
    if ("error" in page) {
      res.status(400).json({ msg: page.error });
      return;
    }
    const filter = { user: req.userId };
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).skip(page.offset).limit(page.limit);
    res.json({ contacts, total, limit: page.limit, offset: page.offset });
  });

  router.post("/", validateBody(contactSchema), async (req, res) => {
    const contact = await Contact.create({ ...req.body, user: req.userId });
    res.status(201).json(contact);
  });

  router.put("/:id", validateBody(contactUpdateSchema), async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ msg: "Contact not found" });
      return;
    }
    const contact = await Contact.findOneAndUpdate({ _id: id, user: req.userId }, { $set: req.body }, { returnDocument: "after" });
    if (!contact) {
      res.status(404).json({ msg: "Contact not found" });
      return;
    }
    res.json(contact);
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ msg: "Contact not found" });
      return;
    }
    const deleted = await Contact.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) {
      res.status(404).json({ msg: "Contact not found" });
      return;
    }
    res.json({ msg: "Contact removed" });
  });

  return router;
}
