import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "@/app/admin/actions";
import { ProductEditor } from "@/components/product-editor";
import { getProductById } from "@/lib/content";
import { requireDeskUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireDeskUser();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="m-0 font-serif text-4xl font-normal">{product.name}</h1>
        <Link href={`/admin/preview/products/${product.id}`}>Preview</Link>
      </div>
      <ProductEditor
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          code: product.code,
          summary: product.summary,
          introduction: product.introduction,
          audience: product.audience,
          onlineEnabled: product.onlineEnabled,
          offlineEnabled: product.offlineEnabled,
          onlineSummary: product.onlineSummary,
          offlineSummary: product.offlineSummary,
          onlineDetail: product.onlineDetail,
          offlineDetail: product.offlineDetail,
          imageUrl: product.imageUrl,
          sortOrder: product.sortOrder,
          published: product.published,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          features: product.features.map((feature) => ({ title: feature.title, body: feature.body })),
        }}
      />
      <form action={deleteProduct} className="mt-10">
        <input type="hidden" name="id" value={product.id} />
        <button type="submit" className="secondary">
          Remove this product
        </button>
      </form>
    </>
  );
}
