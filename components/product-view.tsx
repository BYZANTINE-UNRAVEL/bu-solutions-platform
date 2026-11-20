import { Markdown } from "@/components/markdown";
import type { ProductWithFeatures } from "@/lib/content";

export function ProductView({
  product,
  index,
  preview = false,
}: {
  product: ProductWithFeatures;
  index: number;
  preview?: boolean;
}) {
  const modes = [
    product.onlineEnabled
      ? { key: "online", title: "Online", summary: product.onlineSummary, detail: product.onlineDetail }
      : null,
    product.offlineEnabled
      ? {
          key: "offline",
          title: "On the premises",
          summary: product.offlineSummary,
          detail: product.offlineDetail,
        }
      : null,
  ].filter((mode) => mode !== null);

  return (
    <article>
      {preview ? (
        <p className="mb-8 border border-oxide px-4 py-3 text-sm text-oxide">
          {product.published
            ? "Preview of the published page. Visitors can open it."
            : "Preview only. This product is not on the public site."}
        </p>
      ) : null}
      <p className="m-0 font-sans text-xs tracking-[0.16em] text-muted uppercase">
        {String(index).padStart(2, "0")} · {product.code}
      </p>
      <h1 className="mt-3 mb-4 font-serif text-5xl leading-[1.05] font-normal">{product.name}</h1>
      <p className="measure text-xl leading-snug">{product.summary}</p>
      <p className="text-sm text-muted">For {product.audience}</p>

      <section className="mt-12 measure">
        <h2 className="font-serif text-3xl font-normal">What it does</h2>
        <Markdown source={product.introduction} />
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-3xl font-normal">What it covers</h2>
        <dl className="m-0 border-t border-line">
          {product.features.map((feature) => (
            <div key={feature.id} className="grid gap-2 border-b border-line py-4 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8">
              <dt className="font-serif text-xl">{feature.title}</dt>
              <dd className="m-0 text-ink">{feature.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {modes.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-3xl font-normal">How it is installed</h2>
          <p className="measure text-muted">
            The application is a web app in both places. The difference is where the server sits.
          </p>
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            {modes.map((mode) => (
              <div key={mode.key}>
                <h3 className="mt-0 mb-2 font-serif text-2xl font-normal">{mode.title}</h3>
                <p className="mt-0">{mode.summary}</p>
                <Markdown source={mode.detail} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
