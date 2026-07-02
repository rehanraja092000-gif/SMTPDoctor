import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "TLS-RPT Checker",
  description: "Check a domain TLS-RPT record for SMTP TLS failure reporting.",
  alternates: { canonical: "/tools/tlsrpt-checker" },
  openGraph: {
    title: "TLS-RPT Checker — SMTPDoctor",
    description: "Check a domain TLS-RPT record for SMTP TLS failure reporting.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="tlsrpt-checker" />
    </>
  );
}
