import type { Metadata } from "next";
import { getGuide } from "../../../lib/guides";
import { SITE } from "../../../lib/tools";
import { buildGuideSchema, SchemaScripts } from "../../../lib/guideSchema";

const guide = getGuide("why-emails-go-to-spam")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: `/guides/${guide.slug}` },
  openGraph: {
    type: "article",
    title: guide.metaTitle,
    description: guide.metaDescription,
    url: `${SITE.url}/guides/${guide.slug}`,
  },
};

const faqs = [
  {
    q: "Why are my emails suddenly going to spam?",
    a: "A sudden change usually points to one of three things: your domain or IP was recently blacklisted, an authentication record (SPF, DKIM, or DMARC) broke or expired, or a spike in spam complaints damaged your reputation. Check your blacklist status and authentication first, since those are the most common sudden causes.",
  },
  {
    q: "Does having SPF, DKIM, and DMARC guarantee inbox placement?",
    a: "No. Authentication is necessary but not sufficient. It proves your mail is genuine, but providers still weigh your sending reputation, recipient engagement, content, and list quality. Passing authentication with a poor reputation or spammy content can still land you in spam.",
  },
  {
    q: "How do I stop my emails from going to spam?",
    a: "Fix authentication first (valid SPF under the 10-lookup limit, DKIM signing, and enforced DMARC), confirm you are not blacklisted, clean your mailing list to cut bounces and complaints, and avoid spammy content and misleading subject lines. Then send consistently to engaged recipients.",
  },
  {
    q: "Can spammy content alone send good email to spam?",
    a: "Yes. Even a perfectly authenticated message from a reputable domain can be filtered if the content triggers spam signals — excessive links, spammy phrases, all-caps subject lines, image-only emails, or misleading claims. Content is one of several factors providers evaluate together.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScripts schemas={buildGuideSchema("why-emails-go-to-spam", faqs)} />
      {children}
    </>
  );
}
