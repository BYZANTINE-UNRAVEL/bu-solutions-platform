import { notFound } from "next/navigation";
import { PageForm } from "@/components/page-form";
import { prisma } from "@/lib/db";
import { requireDeskUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ key: string }> }) {
  await requireDeskUser();
  const { key } = await params;
  const page = await prisma.page.findUnique({ where: { key } });
  if (!page) notFound();
  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Edit {page.key}</h1>
      <PageForm page={page} />
    </>
  );
}
