import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "WHOIS Lookup",
  description: "Look up registrar, registration dates, and ownership data for any domain.",
  alternates: { canonical: "/tools/whois-checker" },
  openGraph: {
    title: "WHOIS Lookup — SMTPDoctor",
    description: "Look up registrar, registration dates, and ownership data for any domain.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="whois-checker" />
    </>
  );
}
