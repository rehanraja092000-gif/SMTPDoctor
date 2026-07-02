import type { Metadata } from "next";
import ToolContent from "../../components/ToolContent";

export const metadata: Metadata = {
  title: "TXT Record Lookup",
  description: "View all raw TXT records published for a domain.",
  alternates: { canonical: "/tools/txt-checker" },
  openGraph: {
    title: "TXT Record Lookup — SMTPDoctor",
    description: "View all raw TXT records published for a domain.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolContent slug="txt-checker" />
    </>
  );
}
