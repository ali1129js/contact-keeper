import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Contact } from "../models/Contact.js";
import { contactSchema, contactUpdateSchema } from "../schemas.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

export function contactsRouter(jwtSecret: string): Router {
  const router = Router();
  router.use(requireAuth(jwtSecret));

  router.get("/", async (req, res) => {
    const contacts = await Contact.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(contacts);
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
    const contact = await Contact.findOneAndUpdate({ _id: id, user: req.userId }, { $set: req.body }, { new: true });
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
