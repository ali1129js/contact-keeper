import { createHash, timingSafeEqual } from "node:crypto";
import { Router } from "express";
import { seed } from "../scripts/seed.js";

const digest = (v: string) => createHash("sha256").update(v).digest();

// Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` with each GET.
export function cronRouter(cfg: { secret?: string; bcryptRounds: number }): Router {
  const router = Router();

  router.get("/reset-demo", async (req, res) => {
    const header = req.header("authorization") ?? "";
    const ok = !!cfg.secret && timingSafeEqual(digest(header), digest(`Bearer ${cfg.secret}`));
    if (!ok) {
      res.status(401).json({ msg: "Unauthorized" });
      return;
    }
    const contacts = await seed(cfg.bcryptRounds);
    res.json({ ok: true, contacts });
  });

  return router;
}
