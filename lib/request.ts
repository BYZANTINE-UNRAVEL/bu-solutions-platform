import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { sessionSecret } from "@/lib/secret";

/**
 * How many reverse proxies sit in front of the app and append to X-Forwarded-For.
 * The address is read from the entry the outermost trusted proxy appended, so
 * anything a client puts at the start of the header is ignored.
 *
 * The app must sit behind at least one such proxy. Next.js keeps an
 * X-Forwarded-For that a client sends directly, so without a proxy the
 * address cannot be trusted.
 */
function trustedProxyHops() {
  const value = Number(process.env.TRUST_PROXY_HOPS ?? "1");
  return Number.isInteger(value) && value >= 1 && value <= 10 ? value : 1;
}

export async function clientIp() {
  const headerStore = await headers();
  const chain = (headerStore.get("x-forwarded-for") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (chain.length === 0) return "unknown";
  const ip = chain[Math.max(0, chain.length - trustedProxyHops())];
  return ip.slice(0, 80);
}

export function keyedHash(value: string) {
  return createHash("sha256").update(`${sessionSecret()}:${value}`).digest("hex");
}

export async function clientIpHash() {
  return keyedHash(await clientIp());
}
