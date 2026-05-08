// TODO:
// Hint: compute windowStart = floor(now / windowMs) * windowMs.
// Use findOneAndUpdate with { upsert: true, new: true } and $inc: { count: 1 } on { key, windowStart }.
// If returned count > max, throw HttpError(429). Otherwise next().
// See: docs/API.md "Rate limiting", tester/tests/bonus-rate-limit.test.js

// TODO:
// Hint: prefer x-forwarded-for (first IP before comma) — required behind proxies/serverless.
// Fall back to req.socket.remoteAddress, then 'unknown'.

import { RateLimitHit } from "../models/RateLimitHit.js";
import { HttpError } from "./errorHandler.js";

export function rateLimit({ max, windowMs, keyFn }) {
  return async function rateLimitMiddleware(req, _res, next) {
    try {
      const now = Date.now();
      const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
      const key = keyFn(req);

      const record = await RateLimitHit.findOneAndUpdate(
        { key, windowStart },
        { $inc: { count: 1 } },
        { upsert: true, new: true },
      );

      if (record.count > max) {
        return next(new HttpError(429, "Too many requests"));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}
