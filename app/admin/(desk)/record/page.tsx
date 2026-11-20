import { prisma } from "@/lib/db";
import { formatWhen } from "@/lib/format";
import { requireDeskUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RecordPage() {
  await requireDeskUser();
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Record</h1>
      <p className="text-muted">Who changed the site, and when. The latest hundred entries.</p>
      {rows.length === 0 ? (
        <p>No changes recorded yet.</p>
      ) : (
        <ol className="m-0 list-none p-0">
          {rows.map((row) => (
            <li key={row.id} className="border-b border-line py-3">
              <time className="text-sm text-muted" dateTime={row.createdAt.toISOString()}>
                {formatWhen(row.createdAt)}
              </time>
              <p className="m-0">{row.summary}</p>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
