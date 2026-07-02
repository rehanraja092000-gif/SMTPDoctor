import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "SPF Checker",
  description: "Check any domains SPF record for validity, syntax errors, and lookup limits - free, instant, no signup.",
  alternates: { canonical: "/tools/spf-checker" },
  openGraph: {
    title: "SPF Checker — SMTPDoctor",
    description: "Check any domains SPF record for validity, syntax errors, and lookup limits - free, instant, no signup.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="spf-checker" />
    </>
  );
}
