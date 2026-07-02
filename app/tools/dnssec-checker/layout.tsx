import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "DNSSEC Checker",
  description: "Check whether a domain has DNSSEC enabled to protect against DNS spoofing and cache poisoning.",
  alternates: { canonical: "/tools/dnssec-checker" },
  openGraph: {
    title: "DNSSEC Checker — SMTPDoctor",
    description: "Check whether a domain has DNSSEC enabled to protect against DNS spoofing and cache poisoning.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="dnssec-checker" />
    </>
  );
}
