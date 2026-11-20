import { prisma } from "@/lib/db";

const windows = {
  login: { minutes: 15, max: 8 },
  contact: { minutes: 60, max: 5 },
} as const;

function sinceFor(kind: keyof typeof windows) {
  const rule = windows[kind];
  return { rule, since: new Date(Date.now() - rule.minutes * 60 * 1000) };
}

export async function tooManyAttempts(kind: keyof typeof windows, ipHash: string) {
  const { rule, since } = sinceFor(kind);
  if (kind === "login") {
    await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: since } } });
    const count = await prisma.loginAttempt.count({ where: { ipHash, createdAt: { gte: since } } });
    return count >= rule.max;
  }
  await prisma.formAttempt.deleteMany({ where: { createdAt: { lt: since } } });
  const count = await prisma.formAttempt.count({ where: { ipHash, createdAt: { gte: since } } });
  return count >= rule.max;
}

export async function noteAttempt(kind: keyof typeof windows, ipHash: string) {
  if (kind === "login") {
    await prisma.loginAttempt.create({ data: { ipHash } });
    return;
  }
  await prisma.formAttempt.create({ data: { ipHash } });
}
