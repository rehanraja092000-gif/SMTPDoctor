import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNS Propagation Checker",
  description: "Compare DNS answers across Google, Cloudflare, Quad9, and OpenDNS to check propagation status.",
  alternates: { canonical: "/tools/propagation-checker" },
  openGraph: {
    title: "DNS Propagation Checker — SMTPDoctor",
    description: "Compare DNS answers across Google, Cloudflare, Quad9, and OpenDNS to check propagation status.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
