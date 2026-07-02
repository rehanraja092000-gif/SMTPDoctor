import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "MTA-STS Checker",
  description: "Check a domain MTA-STS policy that enforces TLS encryption for inbound email.",
  alternates: { canonical: "/tools/mtasts-checker" },
  openGraph: {
    title: "MTA-STS Checker — SMTPDoctor",
    description: "Check a domain MTA-STS policy that enforces TLS encryption for inbound email.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="mtasts-checker" />
    </>
  );
}
