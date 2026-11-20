import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20">
      <p className="m-0 text-xs tracking-[0.16em] text-muted uppercase">404</p>
      <h1 className="mt-3 font-serif text-5xl font-normal">That page is not in the catalogue.</h1>
      <p>
        <Link href="/">Return to Byzantine Unravel</Link>
      </p>
    </main>
  );
}
