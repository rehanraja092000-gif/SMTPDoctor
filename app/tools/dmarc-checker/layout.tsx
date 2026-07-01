import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMARC Checker",
  description: "Check a domains DMARC policy, alignment mode, and reporting addresses.",
  alternates: { canonical: "/tools/dmarc-checker" },
  openGraph: {
    title: "DMARC Checker — SMTPDoctor",
    description: "Check a domains DMARC policy, alignment mode, and reporting addresses.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
