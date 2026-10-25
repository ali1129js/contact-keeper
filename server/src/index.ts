import "./loadDotenv.js";
import { createApp } from "./app.js";
import { connectDB } from "./db.js";
import { loadEnv } from "./env.js";

const env = loadEnv();
await connectDB(env.MONGODB_URI);

const app = createApp({
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  clientOrigin: env.CLIENT_ORIGIN,
});

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
