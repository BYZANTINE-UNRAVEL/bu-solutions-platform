import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProductsDesk() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h1 className="m-0 font-serif text-4xl font-normal">Products</h1>
        <Link href="/admin/products/new" className="button">
          New product
        </Link>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-sm text-muted">
            <th className="py-2 font-normal">Order</th>
            <th className="py-2 font-normal">Name</th>
            <th className="py-2 font-normal">State</th>
            <th className="py-2 font-normal">Modes</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-line">
              <td className="py-3 tabular-nums">{product.sortOrder}</td>
              <td className="py-3">
                <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
                <span className="block text-sm text-muted">/products/{product.slug}</span>
              </td>
              <td className="py-3">{product.published ? "Published" : "Draft"}</td>
              <td className="py-3 text-sm">
                {[product.onlineEnabled ? "Online" : null, product.offlineEnabled ? "On-premises" : null]
                  .filter(Boolean)
                  .join(" · ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
