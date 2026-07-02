import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "Blacklist Checker",
  description: "Check whether a domain or IP is listed on major real-time blackhole lists (RBLs).",
  alternates: { canonical: "/tools/blacklist-checker" },
  openGraph: {
    title: "Blacklist Checker — SMTPDoctor",
    description: "Check whether a domain or IP is listed on major real-time blackhole lists (RBLs).",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="blacklist-checker" />
    </>
  );
}
