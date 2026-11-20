import { revalidatePath } from "next/cache";

export function refreshPublic(extra: string[] = []) {
  const paths = ["/", "/products", "/contact", "/sitemap.xml", ...extra];
  for (const path of paths) revalidatePath(path);
}
