import Link from "next/link";

export function SiteHeader({ shortName }: { shortName: string }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 px-5 py-5">
        <Link href="/" className="font-sans text-[0.78rem] tracking-[0.16em] uppercase no-underline">
          {shortName}
        </Link>
        <nav className="flex gap-6 text-[0.95rem]">
          <Link href="/products" className="no-underline">
            Products
          </Link>
          <Link href="/contact" className="no-underline">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
