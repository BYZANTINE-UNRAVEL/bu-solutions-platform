"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { recordChange } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { refreshPublic } from "@/lib/revalidate";
import { fieldErrors, pageSchema, productSchema, settingsSchema } from "@/lib/validators";

export type FormState = { formError?: string; fieldErrors?: Record<string, string>; ok?: boolean };

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export async function signOut() {
  const { destroySession } = await import("@/lib/auth");
  await destroySession();
  redirect("/admin/login");
}

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = settingsSchema.safeParse({
    companyName: formData.get("companyName"),
    shortName: formData.get("shortName"),
    caption: formData.get("caption"),
    introduction: formData.get("introduction"),
    contactEmail: formData.get("contactEmail") ?? "",
    contactPhone: formData.get("contactPhone") ?? "",
    address: formData.get("address") ?? "",
    enquiryRetentionMonths: formData.get("enquiryRetentionMonths"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  await prisma.siteSetting.update({ where: { id: 1 }, data: parsed.data });
  await recordChange({
    actorId: user.id,
    action: "update",
    entity: "site",
    entityId: "1",
    summary: `${user.email} updated the company introduction and contact details`,
  });
  refreshPublic();
  return { ok: true };
}

export async function savePage(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const key = String(formData.get("key") ?? "");
  if (!["home", "products", "contact"].includes(key)) return { formError: "Unknown page" };

  const parsed = pageSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    canonicalPath: formData.get("canonicalPath"),
    heading: formData.get("heading"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  await prisma.page.update({ where: { key }, data: parsed.data });
  await recordChange({
    actorId: user.id,
    action: "update",
    entity: "page",
    entityId: key,
    summary: `${user.email} updated the ${key} page`,
  });
  refreshPublic([parsed.data.canonicalPath]);
  return { ok: true };
}

function readProduct(formData: FormData) {
  let features: unknown = [];
  try {
    features = JSON.parse(String(formData.get("features") ?? "[]"));
  } catch {
    features = [];
  }
  return productSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    code: formData.get("code"),
    summary: formData.get("summary"),
    introduction: formData.get("introduction"),
    audience: formData.get("audience"),
    onlineEnabled: checked(formData, "onlineEnabled"),
    offlineEnabled: checked(formData, "offlineEnabled"),
    onlineSummary: formData.get("onlineSummary"),
    offlineSummary: formData.get("offlineSummary"),
    onlineDetail: formData.get("onlineDetail"),
    offlineDetail: formData.get("offlineDetail"),
    imageUrl: formData.get("imageUrl") ?? "",
    sortOrder: formData.get("sortOrder"),
    published: checked(formData, "published"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    features,
  });
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = readProduct(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const { features: featureInput, ...productData } = parsed.data;
  const id = String(formData.get("id") ?? "");

  const taken = await prisma.product.findUnique({ where: { slug: productData.slug } });
  if (taken && taken.id !== id) return { formError: "That address is already used by another product." };

  const features = featureInput.map((feature, index) => ({ ...feature, sortOrder: index }));

  if (!id) {
    const created = await prisma.product.create({
      data: {
        ...productData,
        features: { create: features },
      },
    });
    await recordChange({
      actorId: user.id,
      action: "create",
      entity: "product",
      entityId: created.id,
      summary: `${user.email} created ${created.name}`,
    });
    refreshPublic([`/products/${created.slug}`]);
    redirect(`/admin/products/${created.id}`);
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { formError: "That product is gone." };

  await prisma.$transaction(async (tx) => {
    if (existing.slug !== productData.slug) {
      const fromPath = `/products/${existing.slug}`;
      const toPath = `/products/${productData.slug}`;
      await tx.redirect.updateMany({ where: { toPath: fromPath }, data: { toPath } });
      await tx.redirect.deleteMany({ where: { OR: [{ fromPath }, { fromPath: toPath }] } });
      await tx.redirect.create({ data: { fromPath, toPath, statusCode: 308 } });
    }
    await tx.feature.deleteMany({ where: { productId: id } });
    await tx.product.update({
      where: { id },
      data: { ...productData, features: { create: features } },
    });
  });

  await recordChange({
    actorId: user.id,
    action: "update",
    entity: "product",
    entityId: id,
    summary: `${user.email} updated ${productData.name}${existing.slug !== productData.slug ? ` and redirected /products/${existing.slug}` : ""}`,
  });
  refreshPublic([`/products/${existing.slug}`, `/products/${productData.slug}`]);
  revalidatePath(`/admin/products/${id}`);
  return { ok: true };
}

export async function deleteProduct(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) redirect("/admin/products");
  const path = `/products/${product.slug}`;
  await prisma.$transaction([
    prisma.redirect.deleteMany({ where: { OR: [{ fromPath: path }, { toPath: path }] } }),
    prisma.product.delete({ where: { id } }),
  ]);
  await recordChange({
    actorId: user.id,
    action: "delete",
    entity: "product",
    entityId: id,
    summary: `${user.email} removed ${product.name}`,
  });
  refreshPublic([`/products/${product.slug}`]);
  redirect("/admin/products");
}

export async function deleteEnquiry(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.enquiry.deleteMany({ where: { id } });
  await recordChange({
    actorId: user.id,
    action: "delete",
    entity: "enquiry",
    entityId: id,
    summary: `${user.email} deleted an enquiry`,
  });
  revalidatePath("/admin/enquiries");
}

export async function purgeOldEnquiries() {
  const user = await requireUser();
  const site = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const months = site?.enquiryRetentionMonths ?? 24;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  const result = await prisma.enquiry.deleteMany({ where: { createdAt: { lt: cutoff } } });
  await recordChange({
    actorId: user.id,
    action: "purge",
    entity: "enquiry",
    entityId: "retention",
    summary: `${user.email} deleted ${result.count} enquiries older than ${months} months`,
  });
  revalidatePath("/admin/enquiries");
}
