import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "PTR Lookup",
  description: "Reverse DNS lookup - find the hostname behind an IP address.",
  alternates: { canonical: "/tools/ptr-checker" },
  openGraph: {
    title: "PTR Lookup — SMTPDoctor",
    description: "Reverse DNS lookup - find the hostname behind an IP address.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="ptr-checker" />
    </>
  );
}
