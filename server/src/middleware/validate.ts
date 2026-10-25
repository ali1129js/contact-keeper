import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        errors: result.error.issues.map((i) => ({ field: i.path.join("."), msg: i.message })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
