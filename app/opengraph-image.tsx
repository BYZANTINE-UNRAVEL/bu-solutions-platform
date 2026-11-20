import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";

export const alt = "Byzantine Unravel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const site = await getSite();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3efe6",
          color: "#1c1915",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>{site.shortName}</div>
        <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 980 }}>{site.caption}</div>
        <div style={{ fontSize: 24 }}>{site.companyName}</div>
      </div>
    ),
    size,
  );
}
