/**
 * Short-lived token for Puppeteer export routes.
 *
 * The token carries the user's access-token so the print page can fetch
 * profile data on behalf of the user.  It is HMAC-signed and expires
 * after 60 seconds — only used internally by the export API routes.
 */

import { createHmac, randomBytes } from "crypto";

const SECRET =
  process.env.EXPORT_TOKEN_SECRET ||
  // Fallback: derive from the Next.js build ID which is unique per deployment
  `injaz-export-${process.env.NEXT_BUILD_ID || "dev"}`;

const TTL_MS = 60_000; // 60 seconds

interface TokenPayload {
  /** The user's original JWT access token */
  accessToken: string;
  /** Profile ID the token is scoped to */
  profileId: string;
  /** Unix-ms expiry */
  exp: number;
  /** Random nonce to prevent replay */
  nonce: string;
}

function sign(payload: TokenPayload): string {
  const data = JSON.stringify(payload);
  const hmac = createHmac("sha256", SECRET).update(data).digest("hex");
  // base64url-encode the payload + signature
  const raw = JSON.stringify({ d: data, s: hmac });
  return Buffer.from(raw).toString("base64url");
}

function verify(token: string): TokenPayload | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const { d, s } = JSON.parse(raw) as { d: string; s: string };
    const expected = createHmac("sha256", SECRET).update(d).digest("hex");
    if (s !== expected) return null;
    const payload: TokenPayload = JSON.parse(d);
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Create a short-lived export token. Call from the API route handler. */
export function createExportToken(accessToken: string, profileId: string): string {
  return sign({
    accessToken,
    profileId,
    exp: Date.now() + TTL_MS,
    nonce: randomBytes(8).toString("hex"),
  });
}

/**
 * Verify an export token and return the embedded access token + profileId.
 * Returns null if the token is invalid or expired.
 */
export function verifyExportToken(
  token: string,
): { accessToken: string; profileId: string } | null {
  const payload = verify(token);
  if (!payload) return null;
  return { accessToken: payload.accessToken, profileId: payload.profileId };
}
