export function turnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim() && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
}

export async function verifyTurnstile(token: string, ip: string) {
  // The widget only renders when both keys are set, so only demand a token then.
  if (!turnstileEnabled()) return true;
  const secret = process.env.TURNSTILE_SECRET_KEY!.trim();
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!response.ok) return false;
  const payload = (await response.json()) as { success?: boolean };
  return payload.success === true;
}
