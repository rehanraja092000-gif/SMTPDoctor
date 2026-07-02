import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "Security Headers Checker",
  description: "Audit a website HTTP security headers like CSP, HSTS, and X-Frame-Options.",
  alternates: { canonical: "/tools/headers-checker" },
  openGraph: {
    title: "Security Headers Checker — SMTPDoctor",
    description: "Audit a website HTTP security headers like CSP, HSTS, and X-Frame-Options.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="headers-checker" />
    </>
  );
}
