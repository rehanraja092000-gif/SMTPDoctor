import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "Subdomain Scanner",
  description: "Scan a domain for commonly used subdomains like mail, vpn, cpanel, and more.",
  alternates: { canonical: "/tools/subdomain-checker" },
  openGraph: {
    title: "Subdomain Scanner — SMTPDoctor",
    description: "Scan a domain for commonly used subdomains like mail, vpn, cpanel, and more.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="subdomain-checker" />
    </>
  );
}
