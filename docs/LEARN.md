# Learning notes

Short explanations of the ideas this project actually uses, and why they matter. Each one points at a file.

## JWT bearer tokens

After a successful register or login the API returns a JWT, not a session cookie. The token is signed with `JWT_SECRET` and the payload is only a `sub` (the user id). Contact routes go through `requireAuth`, which checks the `Authorization: Bearer` header, verifies the signature, and then loads only that user's contacts. The secret never ships in the repo: production reads it from the environment (`env.ts` requires at least 32 characters), and `npm run demo` generates a fresh one with `randomBytes` for that process only.

See `signToken` and `requireAuth` in `server/src/middleware/auth.ts`.

## Zod at the boundary

Request bodies and environment variables are untrusted. Zod schemas in `server/src/schemas.ts` and `server/src/env.ts` parse them before any database work. Invalid input becomes a 400 with `{ errors: [{ field, msg }] }` instead of a crash or a half-written document. The JWT payload is checked the same way after `jwt.verify`, so a well-signed token with the wrong shape is still rejected.

See `server/src/schemas.ts`, `server/src/env.ts` and `payloadSchema` in `server/src/middleware/auth.ts`.

## `npm run demo`

A full MongoDB install is not required to try the app. `npm run demo` starts `MongoMemoryServer`, seeds the fictional user `demo@example.com` and a handful of made-up contacts, then serves the API and the Vite client. The JWT secret is random for that run, and the in-memory database disappears when you stop the process. That is why the README login works without a `.env` file.

See `server/src/scripts/demo.ts` and `server/src/scripts/seed.ts`.
