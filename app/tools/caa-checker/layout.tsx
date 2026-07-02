import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "CAA Checker",
  description: "Check a domain CAA records that control which certificate authorities may issue certificates.",
  alternates: { canonical: "/tools/caa-checker" },
  openGraph: {
    title: "CAA Checker — SMTPDoctor",
    description: "Check a domain CAA records that control which certificate authorities may issue certificates.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="caa-checker" />
    </>
  );
}
