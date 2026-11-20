import { deleteEnquiry, purgeOldEnquiries } from "@/app/admin/actions";
import { prisma } from "@/lib/db";
import { formatWhen } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const [site, enquiries] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  const months = site?.enquiryRetentionMonths ?? 24;

  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Enquiries</h1>
      <p className="max-w-xl text-muted">
        An enquiry is personal data. It is kept for {months} months, then deleted from this desk. You can delete one at any time.
      </p>
      <form action={purgeOldEnquiries} className="mb-8">
        <button type="submit" className="secondary">
          Remove enquiries older than {months} months
        </button>
      </form>
      {enquiries.length === 0 ? (
        <p>No enquiries yet.</p>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <article key={enquiry.id} className="border border-line p-4">
              <header className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="m-0 font-serif text-2xl font-normal">{enquiry.name}</h2>
                <time className="text-sm text-muted" dateTime={enquiry.createdAt.toISOString()}>
                  {formatWhen(enquiry.createdAt)}
                </time>
              </header>
              <p className="text-sm">
                <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                {enquiry.phone ? ` · ${enquiry.phone}` : ""}
                {enquiry.organisation ? ` · ${enquiry.organisation}` : ""}
                {enquiry.productInterest ? ` · ${enquiry.productInterest}` : ""}
              </p>
              <p className="whitespace-pre-line">{enquiry.message}</p>
              <form action={deleteEnquiry}>
                <input type="hidden" name="id" value={enquiry.id} />
                <button type="submit" className="secondary">
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
