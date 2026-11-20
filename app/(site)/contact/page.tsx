import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Markdown } from "@/components/markdown";
import { getPage, getPublishedProducts, getSite } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.canonicalPath },
    openGraph: { title: page.title, description: page.description, url: page.canonicalPath },
  };
}

export default async function ContactPage() {
  const [page, site, products] = await Promise.all([
    getPage("contact"),
    getSite(),
    getPublishedProducts(),
  ]);

  return (
    <>
      <h1 className="mt-0 mb-4 font-serif text-5xl leading-[1.05] font-normal">{page.heading}</h1>
      <section className="measure">
        <Markdown source={page.body} />
      </section>
      {site.contactEmail || site.contactPhone || site.address ? (
        <dl className="mt-8 mb-10 grid gap-4 text-sm md:grid-cols-3">
          {site.contactEmail ? (
            <div>
              <dt className="text-muted uppercase tracking-[0.08em]">Email</dt>
              <dd className="m-0 mt-1">
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              </dd>
            </div>
          ) : null}
          {site.contactPhone ? (
            <div>
              <dt className="text-muted uppercase tracking-[0.08em]">Phone</dt>
              <dd className="m-0 mt-1">{site.contactPhone}</dd>
            </div>
          ) : null}
          {site.address ? (
            <div>
              <dt className="text-muted uppercase tracking-[0.08em]">Address</dt>
              <dd className="m-0 mt-1 whitespace-pre-line">{site.address}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      <ContactForm products={products.map((product) => ({ slug: product.slug, name: product.name }))} />
    </>
  );
}
