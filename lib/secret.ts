export function sessionSecret() {
  const value = process.env.SESSION_SECRET?.trim() ?? "";
  if (value.length >= 32) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  return "dev-only-session-secret-not-for-production";
}

export function siteUrl() {
  const configured = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  return "http://127.0.0.1:3847";
}
