import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "Domain Age Checker",
  description: "Find a domain registration date, age, and expiry from WHOIS data.",
  alternates: { canonical: "/tools/domain-age-checker" },
  openGraph: {
    title: "Domain Age Checker — SMTPDoctor",
    description: "Find a domain registration date, age, and expiry from WHOIS data.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="domain-age-checker" />
    </>
  );
}
