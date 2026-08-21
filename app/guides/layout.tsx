import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical guides to email deliverability, DNS, and domain security — SPF, DKIM, DMARC, domain reputation, and more.",
  alternates: { canonical: "/guides" },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
