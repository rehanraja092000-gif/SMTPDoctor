import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "SMTP Port Tester",
  description: "Test common mail, web, and hosting control panel ports for a host.",
  alternates: { canonical: "/tools/port-checker" },
  openGraph: {
    title: "SMTP Port Tester — SMTPDoctor",
    description: "Test common mail, web, and hosting control panel ports for a host.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="port-checker" />
    </>
  );
}
