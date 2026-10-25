// Local demo: starts an in-memory MongoDB, seeds fictional data and runs the API.
// No real database or secrets needed. Data is lost on exit.
import { randomBytes } from "node:crypto";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../app.js";
import { connectDB } from "../db.js";
import { DEMO_USER, seed } from "./seed.js";

const mongo = await MongoMemoryServer.create();
await connectDB(mongo.getUri());
await seed();

const port = Number(process.env.PORT ?? 5000);
createApp({ jwtSecret: randomBytes(48).toString("hex") }).listen(port, () => {
  console.log(`Demo API on http://localhost:${port} (log in as ${DEMO_USER.email} / ${DEMO_USER.password})`);
});
