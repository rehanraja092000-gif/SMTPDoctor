import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "CNAME Lookup",
  description: "Check CNAME alias records for any subdomain.",
  alternates: { canonical: "/tools/cname-checker" },
  openGraph: {
    title: "CNAME Lookup — SMTPDoctor",
    description: "Check CNAME alias records for any subdomain.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="cname-checker" />
    </>
  );
}
