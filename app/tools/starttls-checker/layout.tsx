import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "STARTTLS Checker",
  description: "Check whether a mail server supports STARTTLS encryption for email in transit.",
  alternates: { canonical: "/tools/starttls-checker" },
  openGraph: {
    title: "STARTTLS Checker — SMTPDoctor",
    description: "Check whether a mail server supports STARTTLS encryption for email in transit.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="starttls-checker" />
    </>
  );
}
