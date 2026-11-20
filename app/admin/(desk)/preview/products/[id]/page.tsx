import { notFound } from "next/navigation";
import { ProductView } from "@/components/product-view";
import { getProductById, getPublishedProducts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PreviewProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const published = await getPublishedProducts();
  const index = published.findIndex((item) => item.id === product.id);
  return (
    <div className="bg-paper">
      <ProductView product={product} index={index >= 0 ? index + 1 : product.sortOrder} preview />
    </div>
  );
}
