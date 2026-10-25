import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "../schemas.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, signToken } from "../middleware/auth.js";

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
}

export function authRouter(cfg: AuthConfig): Router {
  const router = Router();

  // POST /api/auth/register
  router.post("/register", validateBody(registerSchema), async (req, res) => {
    const { name, email, password } = req.body as RegisterInput;
    if (await User.exists({ email })) {
      res.status(409).json({ msg: "User already exists" });
      return;
    }
    const hash = await bcrypt.hash(password, cfg.bcryptRounds);
    const user = await User.create({ name, email, password: hash });
    res.status(201).json({ token: signToken(user.id as string, cfg.jwtSecret, cfg.jwtExpiresIn) });
  });

  // POST /api/auth/login
  router.post("/login", validateBody(loginSchema), async (req, res) => {
    const { email, password } = req.body as LoginInput;
    const user = await User.findOne({ email }).select("+password");
    const ok = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !ok) {
      res.status(401).json({ msg: "Invalid credentials" });
      return;
    }
    res.json({ token: signToken(user.id as string, cfg.jwtSecret, cfg.jwtExpiresIn) });
  });

  // GET /api/auth/me
  router.get("/me", requireAuth(cfg.jwtSecret), async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    res.json({ id: user.id as string, name: user.name, email: user.email });
  });

  return router;
}
