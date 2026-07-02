import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "SMTP Banner Check",
  description: "Connect to a mail server and read its SMTP banner and advertised capabilities.",
  alternates: { canonical: "/tools/smtp-banner-checker" },
  openGraph: {
    title: "SMTP Banner Check — SMTPDoctor",
    description: "Connect to a mail server and read its SMTP banner and advertised capabilities.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="smtp-banner-checker" />
    </>
  );
}
