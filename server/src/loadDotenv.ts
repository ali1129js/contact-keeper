import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Loads the repo root .env for local development, if present. Real deployments set env vars directly.
const rootEnv = fileURLToPath(new URL("../../.env", import.meta.url));
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);
