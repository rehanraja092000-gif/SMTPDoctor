import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Reputation Checker",
  description: "Get a composite deliverability and safety score based on SPF, DMARC, MX, and threat data.",
  alternates: { canonical: "/tools/reputation-checker" },
  openGraph: {
    title: "Domain Reputation Checker — SMTPDoctor",
    description: "Get a composite deliverability and safety score based on SPF, DMARC, MX, and threat data.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
