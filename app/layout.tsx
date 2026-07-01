import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://smtpdoctor.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SMTPDoctor — Free Email Deliverability & DNS Diagnostic Tools",
    template: "%s — SMTPDoctor",
  },
  description:
    "Free SPF, DKIM, DMARC, DNS, and email security diagnostics. Check deliverability, find misconfigurations, and fix email problems in seconds — no signup required.",
  keywords: [
    "SPF checker", "DKIM checker", "DMARC checker", "MX lookup",
    "DNS propagation checker", "email deliverability tool", "blacklist checker",
    "WHOIS lookup", "SMTP port checker", "email authentication",
  ],
  openGraph: {
    type: "website",
    siteName: "SMTPDoctor",
    title: "SMTPDoctor — Free Email Deliverability & DNS Diagnostic Tools",
    description:
      "Free SPF, DKIM, DMARC, DNS, and email security diagnostics. No signup required.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "SMTPDoctor — Free Email Deliverability & DNS Diagnostic Tools",
    description:
      "Free SPF, DKIM, DMARC, DNS, and email security diagnostics. No signup required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[#05130c] focus:font-semibold"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
