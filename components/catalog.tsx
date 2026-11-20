import Link from "next/link";
import type { ProductWithFeatures } from "@/lib/content";

function modes(product: ProductWithFeatures) {
  return [
    product.onlineEnabled ? "Online" : null,
    product.offlineEnabled ? "On-premises" : null,
  ].filter(Boolean);
}

export function Catalog({ products }: { products: ProductWithFeatures[] }) {
  if (products.length === 0) {
    return <p className="text-muted">The catalogue is being prepared.</p>;
  }

  return (
    <ol className="catalog">
      {products.map((product, index) => (
        <li key={product.id}>
          <Link href={`/products/${product.slug}`} className="row">
            <span className="font-sans text-sm tabular-nums text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="name block font-serif text-2xl leading-none">{product.name}</span>
              <span className="mt-1 block font-sans text-xs tracking-[0.14em] text-muted uppercase">
                {product.code}
              </span>
            </span>
            <span className="summary">
              <span className="block">{product.summary}</span>
              <span className="mt-2 block text-sm text-muted">{modes(product).join(" · ")}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
