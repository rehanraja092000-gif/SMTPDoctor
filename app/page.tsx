export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold">SMTPDoctor</h1>
        <button className="rounded-xl bg-black px-5 py-2 text-white hover:opacity-90">
          Analyze Domain
        </button>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="mb-4 inline-block rounded-full border px-4 py-1 text-sm text-gray-600">
          Email Deliverability Tools
        </p>

        <h2 className="mx-auto max-w-4xl text-5xl font-bold leading-tight">
          Fix SPF, DKIM & DMARC Issues Before Your Emails Hit Spam
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Free tools to analyze your email authentication records, improve inbox
          placement, and keep your domain healthy.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="rounded-xl bg-black px-6 py-3 text-white">
            Start Free Scan
          </button>
          <button className="rounded-xl border px-6 py-3">
            Learn More
          </button>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-4">
        {["SPF Checker", "DKIM Checker", "DMARC Checker", "MX Lookup"].map(
          (tool) => (
            <div
              key={tool}
              className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{tool}</h3>
              <p className="mt-2 text-sm text-gray-600">
                Quickly analyze and validate your DNS records.
              </p>
            </div>
          )
        )}
      </section>
    </main>
  );
}