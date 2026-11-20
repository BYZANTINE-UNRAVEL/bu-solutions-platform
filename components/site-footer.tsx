import Link from "next/link";

export function SiteFooter({
  companyName,
  contactEmail,
}: {
  companyName: string;
  contactEmail: string;
}) {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-3 px-5 py-6 text-sm text-muted">
        <p className="m-0">{companyName}</p>
        {contactEmail ? (
          <a href={`mailto:${contactEmail}`} className="text-ink">
            {contactEmail}
          </a>
        ) : (
          <Link href="/contact" className="text-ink">
            Contact
          </Link>
        )}
      </div>
    </footer>
  );
}
