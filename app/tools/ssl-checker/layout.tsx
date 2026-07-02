import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "SSL / TLS Certificate Checker",
  description: "Check a website SSL/TLS certificate validity, issuer, expiry date, and covered hostnames.",
  alternates: { canonical: "/tools/ssl-checker" },
  openGraph: {
    title: "SSL / TLS Certificate Checker — SMTPDoctor",
    description: "Check a website SSL/TLS certificate validity, issuer, expiry date, and covered hostnames.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="ssl-checker" />
    </>
  );
}
