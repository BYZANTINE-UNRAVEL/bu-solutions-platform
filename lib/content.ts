import { prisma } from "@/lib/db";

const productInclude = {
  features: { orderBy: { sortOrder: "asc" as const } },
};

export async function getSite() {
  const site = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!site) throw new Error("Site settings have not been seeded");
  return site;
}

export async function getPage(key: string) {
  const page = await prisma.page.findUnique({ where: { key } });
  if (!page) throw new Error(`Page ${key} has not been seeded`);
  return page;
}

export async function getPublishedProducts() {
  return prisma.product.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: productInclude,
  });
}

export async function getPublishedProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    include: productInclude,
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, include: productInclude });
}

export async function getRedirect(fromPath: string) {
  return prisma.redirect.findUnique({ where: { fromPath } });
}

export type ProductWithFeatures = NonNullable<Awaited<ReturnType<typeof getProductById>>>;
