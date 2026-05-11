import Link from "next/link";

export default function Home() {
  const tools = [
    { name: "SPF Checker", href: "/tools/spf-checker" },
    { name: "DKIM Checker", href: "/tools/dkim-checker" },
    { name: "DMARC Checker", href: "/tools/dmarc-checker" },
    { name: "MX Lookup", href: "/tools/mx-checker" },
    { name: "Blacklist Checker", href: "/tools/blacklist-checker" },
    { name: "SMTP Port Tester", href: "/tools/port-checker" },
    { name: "NS Lookup", href: "/tools/ns-checker" },
    { name: "PTR Lookup", href: "/tools/ptr-checker" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold">SMTPDoctor</h1>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-5xl font-bold leading-tight">
          Fix Email Deliverability Problems
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          Free tools to validate SPF, DKIM, DMARC and DNS records.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md"
          >
            <h3 className="text-xl font-semibold">{tool.name}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Open tool →
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}