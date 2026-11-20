import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireDeskUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DeskHome() {
  await requireDeskUser();
  const [products, published, enquiries, latest] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.enquiry.count(),
    prisma.auditLog.findFirst({ orderBy: { createdAt: "desc" }, include: { actor: true } }),
  ]);

  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Overview</h1>
      <p className="max-w-xl text-muted">
        The public site reads this desk. A save republishes the pages that changed.
      </p>
      <dl className="grid max-w-2xl gap-4 sm:grid-cols-3">
        <div className="border border-line p-4">
          <dt className="text-sm text-muted">Products</dt>
          <dd className="m-0 font-serif text-3xl">{published} published</dd>
          <dd className="m-0 text-sm text-muted">{products} in the desk</dd>
        </div>
        <div className="border border-line p-4">
          <dt className="text-sm text-muted">Enquiries</dt>
          <dd className="m-0 font-serif text-3xl">{enquiries}</dd>
        </div>
        <div className="border border-line p-4">
          <dt className="text-sm text-muted">Last change</dt>
          <dd className="m-0 text-sm">{latest ? latest.summary : "Nothing recorded yet."}</dd>
        </div>
      </dl>
      <p>
        <Link href="/admin/products">Edit the catalogue</Link>
      </p>
    </>
  );
}
