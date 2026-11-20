"use server";

import { prisma } from "@/lib/db";
import { notifyEnquiry } from "@/lib/mail";
import { clientIp, clientIpHash } from "@/lib/request";
import { noteAttempt, tooManyAttempts } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { enquirySchema, fieldErrors } from "@/lib/validators";

export type EnquiryState = {
  ok?: boolean;
  formError?: string;
  fieldErrors?: Record<string, string>;
};

export async function sendEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true };
  }

  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organisation: formData.get("organisation") ?? "",
    phone: formData.get("phone") ?? "",
    message: formData.get("message"),
    productInterest: formData.get("productInterest") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const ipHash = await clientIpHash();
  if (await tooManyAttempts("contact", ipHash)) {
    return { formError: "Too many enquiries from this network. Try again later." };
  }

  const turnstileOk = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), await clientIp());
  if (!turnstileOk) {
    return { formError: "The spam check did not pass. Reload the page and try again." };
  }

  let productInterest = parsed.data.productInterest;
  if (productInterest) {
    const product = await prisma.product.findFirst({
      where: { slug: productInterest, published: true },
      select: { name: true },
    });
    productInterest = product?.name ?? "";
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      organisation: parsed.data.organisation,
      phone: parsed.data.phone,
      message: parsed.data.message,
      productInterest,
    },
  });
  await noteAttempt("contact", ipHash);

  try {
    await notifyEnquiry(enquiry);
  } catch (error) {
    console.error("enquiry mail failed", error instanceof Error ? error.name : "error");
  }

  return { ok: true };
}
