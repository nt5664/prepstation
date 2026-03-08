import crypto from "crypto";

export function safeEq(a: string | null, b: string | null) {
  if (!a || !b) return false;

  try {
    const A = Buffer.from(a);
    const B = Buffer.from(b);

    return A.length === B.length && crypto.timingSafeEqual(A, B);
  } catch {
    return false;
  }
}
