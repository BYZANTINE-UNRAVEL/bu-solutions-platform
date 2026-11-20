import { prisma } from "@/lib/db";

const windows = {
  login: { minutes: 15, max: 8 },
  /** Failed sign-ins for one email from any address. Stops guessing through rotating IPs. */
  loginAccount: { minutes: 15, max: 20 },
  contact: { minutes: 60, max: 5 },
} as const;

type Kind = keyof typeof windows;

function since(kind: Kind) {
  return new Date(Date.now() - windows[kind].minutes * 60 * 1000);
}

/** Login and per-account keys share the LoginAttempt table; account keys carry an "account:" prefix. */
function storedKey(kind: Kind, key: string) {
  return kind === "loginAccount" ? `account:${key}` : key;
}

export async function tooManyAttempts(kind: Kind, key: string) {
  const from = since(kind);
  const ipHash = storedKey(kind, key);
  if (kind === "contact") {
    await prisma.formAttempt.deleteMany({ where: { createdAt: { lt: from } } });
    const count = await prisma.formAttempt.count({ where: { ipHash, createdAt: { gte: from } } });
    return count >= windows[kind].max;
  }
  await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: from } } });
  const count = await prisma.loginAttempt.count({ where: { ipHash, createdAt: { gte: from } } });
  return count >= windows[kind].max;
}

export async function noteAttempt(kind: Kind, key: string) {
  const ipHash = storedKey(kind, key);
  if (kind === "contact") {
    await prisma.formAttempt.create({ data: { ipHash } });
    return;
  }
  await prisma.loginAttempt.create({ data: { ipHash } });
}
