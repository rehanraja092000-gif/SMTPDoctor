import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NS Lookup",
  description: "Find the authoritative nameservers for any domain.",
  alternates: { canonical: "/tools/ns-checker" },
  openGraph: {
    title: "NS Lookup — SMTPDoctor",
    description: "Find the authoritative nameservers for any domain.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
