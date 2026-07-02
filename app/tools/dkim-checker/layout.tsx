import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "DKIM Checker",
  description: "Find and verify DKIM selectors for any domain, or check a specific selector you already know.",
  alternates: { canonical: "/tools/dkim-checker" },
  openGraph: {
    title: "DKIM Checker — SMTPDoctor",
    description: "Find and verify DKIM selectors for any domain, or check a specific selector you already know.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="dkim-checker" />
    </>
  );
}
