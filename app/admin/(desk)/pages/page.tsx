import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = {
  home: "Home",
  products: "Products",
  contact: "Contact",
};

export default async function PagesIndex() {
  const pages = await prisma.page.findMany({ orderBy: { key: "asc" } });
  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Pages</h1>
      <ul className="max-w-xl list-none p-0">
        {pages.map((page) => (
          <li key={page.id} className="border-b border-line py-3">
            <Link href={`/admin/pages/${page.key}`}>{labels[page.key] ?? page.key}</Link>
            <span className="mt-1 block text-sm text-muted">{page.canonicalPath}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
