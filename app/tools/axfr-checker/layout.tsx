import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "AXFR Checker",
  description: "Test whether a domains nameservers allow unauthorized DNS zone transfers.",
  alternates: { canonical: "/tools/axfr-checker" },
  openGraph: {
    title: "AXFR Checker — SMTPDoctor",
    description: "Test whether a domains nameservers allow unauthorized DNS zone transfers.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="axfr-checker" />
    </>
  );
}
