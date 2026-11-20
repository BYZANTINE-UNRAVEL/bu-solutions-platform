import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { getSite } from "@/lib/content";
import { siteUrl } from "@/lib/secret";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: site.companyName,
      template: `%s · ${site.companyName}`,
    },
    description: site.caption,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
