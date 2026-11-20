import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ProductView } from "@/components/product-view";
import { getPublishedProduct, getPublishedProducts, getRedirect, getSite } from "@/lib/content";
import { siteUrl } from "@/lib/secret";

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) return { title: "Product" };
  const path = `/products/${product.slug}`;
  return {
    title: { absolute: product.seoTitle },
    description: product.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: path,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) {
    const moved = await getRedirect(`/products/${slug}`);
    if (moved && moved.toPath.startsWith("/") && !moved.toPath.startsWith("//")) {
      permanentRedirect(moved.toPath);
    }
    notFound();
  }

  const [products, site] = await Promise.all([getPublishedProducts(), getSite()]);
  const index = products.findIndex((item) => item.id === product.id) + 1;
  const path = `${siteUrl()}/products/${product.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: product.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: product.summary,
          url: path,
          featureList: product.features.map((feature) => feature.title),
          provider: { "@type": "Organization", name: site.companyName, url: siteUrl() },
        }}
      />
      <ProductView product={product} index={index || product.sortOrder} />
    </>
  );
}
