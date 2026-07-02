import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "Open Relay Test",
  description: "Test whether a mail server is an open relay that spammers could abuse.",
  alternates: { canonical: "/tools/openrelay-checker" },
  openGraph: {
    title: "Open Relay Test — SMTPDoctor",
    description: "Test whether a mail server is an open relay that spammers could abuse.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="openrelay-checker" />
    </>
  );
}
