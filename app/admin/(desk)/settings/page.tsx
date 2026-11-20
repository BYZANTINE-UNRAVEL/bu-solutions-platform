import { SettingsForm } from "@/components/settings-form";
import { getSite } from "@/lib/content";
import { requireDeskUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireDeskUser();
  const site = await getSite();
  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Company</h1>
      <p className="max-w-xl text-muted">
        The introduction sits on the home page, under the caption. Contact details appear on the contact page and in the footer.
      </p>
      <SettingsForm values={site} />
    </>
  );
}
