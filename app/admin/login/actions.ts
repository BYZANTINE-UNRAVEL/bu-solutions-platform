"use server";

import { redirect } from "next/navigation";
import { burnPasswordCheck, checkPassword, createSession, safeAdminPath } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientIpHash, keyedHash } from "@/lib/request";
import { noteAttempt, tooManyAttempts } from "@/lib/rate-limit";
import { fieldErrors, loginSchema } from "@/lib/validators";

export type LoginState = { formError?: string; fieldErrors?: Record<string, string> };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const email = parsed.data.email.toLowerCase();
  const ipHash = await clientIpHash();
  const accountHash = keyedHash(email);
  if ((await tooManyAttempts("login", ipHash)) || (await tooManyAttempts("loginAccount", accountHash))) {
    return { formError: "Too many attempts. Wait fifteen minutes and try again." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  let passwordOk = false;
  if (user) {
    passwordOk = await checkPassword(parsed.data.password, user.passwordHash);
  } else {
    await burnPasswordCheck(parsed.data.password);
  }
  if (!user || !passwordOk) {
    await noteAttempt("login", ipHash);
    await noteAttempt("loginAccount", accountHash);
    return { formError: "Email or password is wrong." };
  }

  await createSession(user.id);
  redirect(safeAdminPath(String(formData.get("next") ?? "")));
}
