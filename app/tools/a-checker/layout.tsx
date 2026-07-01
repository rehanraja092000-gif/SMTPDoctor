import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A / AAAA Lookup",
  description: "Look up IPv4 (A) and IPv6 (AAAA) address records for any domain.",
  alternates: { canonical: "/tools/a-checker" },
  openGraph: {
    title: "A / AAAA Lookup — SMTPDoctor",
    description: "Look up IPv4 (A) and IPv6 (AAAA) address records for any domain.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
