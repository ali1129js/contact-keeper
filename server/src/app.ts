import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { contactsRouter } from "./routes/contacts.js";

export interface AppConfig {
  jwtSecret: string;
  jwtExpiresIn?: string;
  clientOrigin?: string;
  bcryptRounds?: number;
}

export function createApp(cfg: AppConfig): express.Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors(cfg.clientOrigin ? { origin: cfg.clientOrigin } : { origin: false }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use(
    "/api/auth",
    authRouter({
      jwtSecret: cfg.jwtSecret,
      jwtExpiresIn: cfg.jwtExpiresIn ?? "7d",
      bcryptRounds: cfg.bcryptRounds ?? 12,
    }),
  );
  app.use("/api/contacts", contactsRouter(cfg.jwtSecret));

  app.use("/api", (_req, res) => {
    res.status(404).json({ msg: "Not found" });
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  };
  app.use(onError);
  return app;
}
