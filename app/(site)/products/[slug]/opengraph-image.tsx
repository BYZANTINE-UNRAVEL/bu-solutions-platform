import { ImageResponse } from "next/og";
import { getPublishedProduct } from "@/lib/content";

export const alt = "Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  const title = product?.name ?? "Byzantine Unravel";
  const summary = product?.summary ?? "";
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
        <div style={{ fontSize: 22, letterSpacing: 6 }}>{product?.code ?? "BU"}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 28, marginTop: 24, maxWidth: 900 }}>{summary}</div>
        </div>
        <div style={{ fontSize: 22 }}>Byzantine Unravel</div>
      </div>
    ),
    size,
  );
}
