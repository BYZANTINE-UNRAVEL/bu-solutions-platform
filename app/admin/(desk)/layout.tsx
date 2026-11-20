import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Desk" },
};

const links = [
  ["Overview", "/admin"],
  ["Company", "/admin/settings"],
  ["Pages", "/admin/pages"],
  ["Products", "/admin/products"],
  ["Enquiries", "/admin/enquiries"],
  ["Record", "/admin/record"],
  ["Users", "/admin/users"],
  ["Account", "/admin/account"],
];

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="desk">
      <aside className="border-r border-line bg-panel px-4 py-6">
        <p className="m-0 text-xs tracking-[0.16em] uppercase">Desk</p>
        <p className="mt-2 mb-6 text-sm text-muted">{user.email}</p>
        <nav className="grid gap-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="no-underline">
              {label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="mt-8">
          <button type="submit" className="secondary">
            Sign out
          </button>
        </form>
      </aside>
      <div className="px-5 py-8 md:px-10">{children}</div>
    </div>
  );
}
