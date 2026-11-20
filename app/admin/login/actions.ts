"use server";

import { redirect } from "next/navigation";
import { checkPassword, createSession, safeAdminPath } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientIpHash } from "@/lib/request";
import { noteAttempt, tooManyAttempts } from "@/lib/rate-limit";
import { fieldErrors, loginSchema } from "@/lib/validators";

export type LoginState = { formError?: string; fieldErrors?: Record<string, string> };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const ipHash = await clientIpHash();
  if (await tooManyAttempts("login", ipHash)) {
    return { formError: "Too many attempts. Wait fifteen minutes and try again." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  const passwordOk = user ? await checkPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !passwordOk) {
    await noteAttempt("login", ipHash);
    return { formError: "Email or password is wrong." };
  }

  await createSession(user.id);
  redirect(safeAdminPath(String(formData.get("next") ?? "")));
}
