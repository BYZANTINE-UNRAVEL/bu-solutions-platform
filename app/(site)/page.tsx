import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { getPage, getPublishedProducts, getSite } from "@/lib/content";
import { siteUrl } from "@/lib/secret";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.canonicalPath },
    openGraph: { title: page.title, description: page.description, url: page.canonicalPath },
  };
}

export default async function HomePage() {
  const [site, page, products] = await Promise.all([
    getSite(),
    getPage("home"),
    getPublishedProducts(),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.companyName,
          alternateName: site.shortName,
          description: site.caption,
          url: siteUrl(),
          email: site.contactEmail || undefined,
        }}
      />
      {site.shortName !== page.heading ? (
        <p className="m-0 font-sans text-xs tracking-[0.16em] text-muted uppercase">{site.shortName}</p>
      ) : null}
      <h1 className="mt-3 mb-5 max-w-3xl font-serif text-5xl leading-[1.05] font-normal md:text-6xl">
        {page.heading}
      </h1>
      <p className="measure font-serif text-2xl leading-snug italic">{site.caption}</p>
      <section className="measure mt-10">
        <Markdown source={site.introduction} />
        <Markdown source={page.body} />
      </section>
      <section className="mt-16">
        <h2 className="font-serif text-3xl font-normal">The catalogue</h2>
        <Catalog products={products} />
      </section>
    </>
  );
}
