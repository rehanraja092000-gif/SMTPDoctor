import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "MX Lookup",
  description: "Look up mail exchanger records and delivery priority for any domain.",
  alternates: { canonical: "/tools/mx-checker" },
  openGraph: {
    title: "MX Lookup — SMTPDoctor",
    description: "Look up mail exchanger records and delivery priority for any domain.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="mx-checker" />
    </>
  );
}
