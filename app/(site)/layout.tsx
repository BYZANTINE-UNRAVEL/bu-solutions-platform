import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSite } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <>
      <SiteHeader shortName={site.shortName} />
      <main className="mx-auto max-w-6xl px-5 py-12">{children}</main>
      <SiteFooter companyName={site.companyName} contactEmail={site.contactEmail} />
    </>
  );
}
