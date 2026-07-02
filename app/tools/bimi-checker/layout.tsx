import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "BIMI Checker",
  description: "Check a domain BIMI record that displays your brand logo in supporting inboxes.",
  alternates: { canonical: "/tools/bimi-checker" },
  openGraph: {
    title: "BIMI Checker — SMTPDoctor",
    description: "Check a domain BIMI record that displays your brand logo in supporting inboxes.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="bimi-checker" />
    </>
  );
}
