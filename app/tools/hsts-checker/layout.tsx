import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "HSTS Checker",
  description: "Check a website HSTS policy that forces browsers to use HTTPS.",
  alternates: { canonical: "/tools/hsts-checker" },
  openGraph: {
    title: "HSTS Checker — SMTPDoctor",
    description: "Check a website HSTS policy that forces browsers to use HTTPS.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="hsts-checker" />
    </>
  );
}
