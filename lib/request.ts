import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { sessionSecret } from "@/lib/secret";

export async function clientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 80);
  }
  return headerStore.get("x-real-ip")?.trim().slice(0, 80) || "unknown";
}

export async function clientIpHash() {
  const ip = await clientIp();
  return createHash("sha256").update(`${sessionSecret()}:${ip}`).digest("hex");
}
