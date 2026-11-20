import { prisma } from "@/lib/db";

export async function recordChange(input: {
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
}) {
  await prisma.auditLog.create({ data: input });
}
