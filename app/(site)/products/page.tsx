import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { Markdown } from "@/components/markdown";
import { getPage, getPublishedProducts } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("products");
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.canonicalPath },
    openGraph: { title: page.title, description: page.description, url: page.canonicalPath },
  };
}

export default async function ProductsPage() {
  const [page, products] = await Promise.all([getPage("products"), getPublishedProducts()]);
  return (
    <>
      <h1 className="mt-0 mb-4 font-serif text-5xl leading-[1.05] font-normal">{page.heading}</h1>
      <section className="measure mb-12">
        <Markdown source={page.body} />
      </section>
      <Catalog products={products} />
    </>
  );
}
